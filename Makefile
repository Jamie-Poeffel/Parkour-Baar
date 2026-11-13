
.PHONY: all image build local configure infra publish deploy logs destroy sync-env

# Configuration
IMAGE_NAME ?= parkour-baar
GHCR_OWNER ?= jamie-poeffel
GHCR_IMAGE = ghcr.io/$(GHCR_OWNER)/$(IMAGE_NAME)
IMAGE_TAG ?= latest

OCI_PUBLIC_IP ?=
# Optional: path to the SSH key. If empty, deploy.ps1 uses ~/.ssh/id_ed25519 and ssh uses its defaults.
SSH_KEY ?=
SSH_KEY_OPT = $(if $(SSH_KEY),-i "$(SSH_KEY)")

all: build

# Build the Docker image locally. NEXT_PUBLIC_* values are inlined at build
# time, so they are passed as build args read from the root .env.
image:
	docker build \
		--build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$(shell node scripts/env-value.mjs NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)" \
		--build-arg NEXT_PUBLIC_GA_ID="$(shell node scripts/env-value.mjs NEXT_PUBLIC_GA_ID)" \
		-t $(IMAGE_NAME):latest .

build: image

# Run the production image locally on http://localhost:3000
local: image
	-docker rm -f parkour-baar-test
	docker run --rm --env-file .env -p 3000:3000 --name parkour-baar-test $(IMAGE_NAME):latest

# Regenerate terraform-aws/app-secrets.json from the root .env
sync-env:
	node scripts/sync-env.mjs

# Check OCI CLI and Terraform configuration
configure:
	oci --version
	terraform -chdir=terraform init
	terraform -chdir=terraform fmt -check
	terraform -chdir=terraform validate
	terraform -chdir=terraform plan

# Provision Oracle Cloud infrastructure
infra:
	terraform -chdir=terraform fmt
	terraform -chdir=terraform validate
	terraform -chdir=terraform plan
	terraform -chdir=terraform apply
	terraform -chdir=terraform output

# Build and publish ARM64 Docker image to GHCR
publish:
	docker buildx build --platform linux/arm64 \
		--build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$(shell node scripts/env-value.mjs NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)" \
		--build-arg NEXT_PUBLIC_GA_ID="$(shell node scripts/env-value.mjs NEXT_PUBLIC_GA_ID)" \
		--tag $(GHCR_IMAGE):$(IMAGE_TAG) --push .

# Deploy application to Oracle VM
deploy:
ifndef OCI_PUBLIC_IP
	$(error OCI_PUBLIC_IP is required. Example: make deploy OCI_PUBLIC_IP=YOUR_IP)
endif
	powershell -NoProfile -ExecutionPolicy Bypass -File deploy/deploy.ps1 -HostIp $(OCI_PUBLIC_IP) $(if $(SSH_KEY),-SshKey "$(SSH_KEY)")

# Show application logs
logs:
ifndef OCI_PUBLIC_IP
	$(error OCI_PUBLIC_IP is required)
endif
	ssh $(SSH_KEY_OPT) ubuntu@$(OCI_PUBLIC_IP) "cd /opt/parkour-baar && docker compose logs --tail=100"

# Restart containers
restart:
ifndef OCI_PUBLIC_IP
	$(error OCI_PUBLIC_IP is required)
endif
	ssh $(SSH_KEY_OPT) ubuntu@$(OCI_PUBLIC_IP) "cd /opt/parkour-baar && docker compose restart"

# Destroy Oracle infrastructure
destroy:
	terraform -chdir=terraform destroy

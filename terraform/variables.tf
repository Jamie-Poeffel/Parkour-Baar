variable "tenancy_ocid" {
  description = "OCI tenancy OCID."
  type        = string
}

variable "user_ocid" {
  description = "OCI API signing user OCID."
  type        = string
}

variable "fingerprint" {
  description = "Fingerprint of the OCI API signing key."
  type        = string
}

variable "private_key_path" {
  description = "Path to the OCI API signing private key on the machine running Terraform."
  type        = string
}

variable "region" {
  description = "OCI home region. Always Free compute must be created in the tenancy home region."
  type        = string
}

variable "compartment_ocid" {
  description = "Compartment OCID where the resources will be created."
  type        = string
}

variable "image_ocid" {
  description = "OCID of a Canonical Ubuntu 24.04 ARM64 image in the selected region."
  type        = string
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key used for the ubuntu user."
  type        = string
}

variable "ssh_ingress_cidr" {
  description = "Your trusted public IP in CIDR notation, e.g. 203.0.113.10/32. Only port 22 is opened."
  type        = string
}

variable "instance_name" {
  type    = string
  default = "parkour-baar"
}

variable "ocpus" {
  description = "Ampere A1 OCPUs. Keep within your Always Free allowance."
  type        = number
  default     = 1
}

variable "memory_in_gbs" {
  description = "Ampere A1 memory in GB. Keep within your Always Free allowance."
  type        = number
  default     = 2
}

variable "boot_volume_size_gbs" {
  description = "Boot volume size in GB. Always Free block storage is shared across boot and block volumes."
  type        = number
  default     = 50
}

variable "grafana_url" {
  description = "Grafana Cloud stack URL."
  type        = string
}

variable "grafana_auth" {
  description = "Grafana service account token."
  type        = string
  sensitive   = true
}

variable "axiom_grafana_token" {
  description = "Axiom API token with read permissions for the Grafana datasource."
  type        = string
  sensitive   = true
}

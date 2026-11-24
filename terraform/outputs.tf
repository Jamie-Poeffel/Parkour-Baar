output "instance_name" {
  value = oci_core_instance.app.display_name
}

output "public_ip" {
  value       = oci_core_instance.app.public_ip
  description = "Use this address for SSH. The website itself is exposed through Cloudflare Tunnel."
}

output "ssh_command" {
  value = "ssh ubuntu@${oci_core_instance.app.public_ip}"
}

output "always_free_shape" {
  value = "${var.ocpus} OCPU / ${var.memory_in_gbs} GB RAM"
}

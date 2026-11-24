resource "grafana_data_source" "axiom" {
  name       = "Parkour-Baar Axiom"
  type       = "axiomhq-axiom-datasource"
  uid        = "parkour-baar-axiom"
  is_default = true

  json_data_encoded = jsonencode({
    apiHost = "https://api.axiom.co"
    edgeURL = "https://eu-central-1.aws.edge.axiom.co"
  })

  secure_json_data_encoded = jsonencode({
    accessToken = var.axiom_grafana_token
  })
}

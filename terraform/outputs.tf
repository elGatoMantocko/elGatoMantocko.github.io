output "pages_url" {
  value = "https://${github_repository_pages.pages.cname}"
}

output "squarespace_dns_record" {
  value = <<-EOT

    ── Manual step: add this DNS record in Squarespace ──────────────────────
    Type:  CNAME
    Host:  elliott
    Value: elgatoMantocko.github.io.
    TTL:   3600 (or Automatic)
    ─────────────────────────────────────────────────────────────────────────

    Squarespace does not have a Terraform provider, so this record must be
    added manually under Domains → elliott.mantock.com → DNS Settings.

  EOT
}

output "pages_url" {
  value = "https://${github_repository_pages.pages.cname}"
}

output "mantock_nameservers" {
  description = "Paste these into Squarespace → Domains → mantock.com → Nameservers to activate Route 53 DNS"
  value       = data.aws_route53_zone.mantock.name_servers
}

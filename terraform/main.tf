data "github_repository" "portfolio" {
  full_name = "elGatoMantocko/elGatoMantocko.github.io"
}

resource "github_repository_pages" "pages" {
  repository      = data.github_repository.portfolio.name
  build_type      = "workflow"
  cname           = "elliott.mantock.com"
  https_enforced  = true
}

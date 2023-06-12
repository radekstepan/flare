export const gates = `"feature/foo":
  # allow everyone from "acme" but "danny"
  eval: "true && IncludeCompany && ExcludeUser"
  conditions:
    - id: IncludeCompany
      operation: include
      kind: context
      path: company
      value:
        - acme
    - id: ExcludeUser
      operation: exclude
      kind: context
      path: user
      value:
        - danny
`;

export const context = `{
  "company": "acme",
  "user": "danny"
}`;

import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: 'http://127.0.0.1:8181/',
    realm: 'miniblog-realm',
    clientId: 'service-client',
})

export default keycloak;
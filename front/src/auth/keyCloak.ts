// src/auth/keyCloak.ts
import Keycloak from "keycloak-js";
import { KEYCLOAK_URL } from "../utils/APIUrlUtil/apiUrlUtil";

const keycloak = new Keycloak({
    url: KEYCLOAK_URL(),
    realm: 'miniblog-realm',
    clientId: 'service-client',
})

export default keycloak;

// Binding events to buttons
document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

const server = "https://www.ersnet.org/identity/";
const authority = "https://identity.ersnet.org"

const config = {
    authority,
    client_id: "c045284d-ba5d-44b1-86e5-b0cfa1cb2be8",
    redirect_uri: `${server}callback.html`,
    response_type: "id_token token",
    scope: "openid profile email ersmbship",
    post_logout_redirect_uri: `${server}index.html`,
};
const mgr = new Oidc.UserManager(config);


mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = server;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://identity.ersnet.org');
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}

function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}
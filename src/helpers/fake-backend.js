export { fakeBackend };

// array in local storage for registered users
const usersKey = 'vue-3-pinia-registration-login-example-users';
const listsKey = 'vue-3-pinia-registration-login-example-lists';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
let lists = JSON.parse(localStorage.getItem(listsKey)) || [];

function fakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && opts.method === 'POST':
                        return authenticate();
                    case url.endsWith('/users/register') && opts.method === 'POST':
                        return register();
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && opts.method === 'GET':
                        return getUserById();
                    case url.match(/\/users\/\d+$/) && opts.method === 'PUT':
                        return updateUser();
                    case url.match(/\/users\/\d+$/) && opts.method === 'DELETE':
                        return deleteUser();
                    
                    case url.endsWith('/lists/create') && opts.method === 'POST':
                        return createList();
                    case url.endsWith('/lists') && opts.method === 'GET':
                        return getLists();
                    case url.match(/\/lists\/\d+$/) && opts.method === 'GET':
                        return getListsById();
                    case url.match(/\/lists\/\d+$/) && opts.method === 'PUT':
                        return updateList();
                    case url.match(/\/lists\/\d+$/) && opts.method === 'DELETE':
                        return deleteList();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Username or password is incorrect');

                return ok({
                    ...basicDetails(user),
                    token: 'fake-jwt-token'
                });
            }

            function register() {
                const user = body();

                if (users.find(x => x.username === user.username)) {
                    return error('Username "' + user.username + '" is already taken')
                }

                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
                users.push(user);
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users.map(x => basicDetails(x)));
            }

            function getUserById() {
                if (!isAuthenticated()) return unauthorized();

                const user = users.find(x => x.id === idFromUrl());
                return ok(basicDetails(user));
            }

            function updateUser() {
                if (!isAuthenticated()) return unauthorized();

                let params = body();
                let user = users.find(x => x.id === idFromUrl());

                // only update password if entered
                if (!params.password) {
                    delete params.password;
                }

                // if username changed check if taken
                if (params.username !== user.username && users.find(x => x.username === params.username)) {
                    return error('Username "' + params.username + '" is already taken')
                }

                // update and save user
                Object.assign(user, params);
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok();
            }

            function deleteUser() {
                if (!isAuthenticated()) return unauthorized();

                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }
            // ++++++++++++++++++++++list
            function createList() {
                const list = body();

                if (lists.find(x => x.todo === list.todo)) {
                    return error('todo "' + list.todo + '" is already taken')
                }
                list.id = lists.length ? Math.max(...lists.map(x => x.id)) + 1 : 1;
                list.todo = list.todo ;
                list.isCompleted = list.isCompleted;
                
                lists.push(list);
                console.log("New Todo list",lists);
                localStorage.setItem(listsKey, JSON.stringify(lists));
                return ok();
            }

            function getLists() {
                if (!isAuthenticated()) return unauthorized();
                console.log("All Todo list",lists);
                return ok(lists.map(x => basicListDetails(x)));
            }

            function getListsById() {
                if (!isAuthenticated()) return unauthorized();

                const list = lists.find(x => x.id === idFromUrl());
                return ok(basicListDetails(list));
            }

            function updateList() {
                if (!isAuthenticated()) return unauthorized();

                let params = body();
                let list = lists.find(x => x.id === idFromUrl());

                // only update password if entered
                if (!params.password) {
                    delete params.password;
                }

                // if username changed check if taken
                if (params.todo !== list.todo && lists.find(x => x.todo === params.todo)) {
                    return error('todo "' + params.todo + '" is already taken')
                }

                // update and save user
                Object.assign(list, params);
                localStorage.setItem(listsKey, JSON.stringify(lists));

                return ok();
            }

            function deleteList() {
                if (!isAuthenticated()) return unauthorized();

                lists = lists.filter(x => x.id !== idFromUrl());
                localStorage.setItem(listsKey, JSON.stringify(lists));
                console.log("All Todo list",lists);
                return ok();
            }


        

            // helper functions

            function ok(body) {
                resolve({ ok: true, ...headers(), json: () => Promise.resolve(body) })
            }

            function unauthorized() {
                resolve({ status: 401, ...headers(), json: () => Promise.resolve({ message: 'Unauthorized' }) })
            }

            function error(message) {
                resolve({ status: 400, ...headers(), json: () => Promise.resolve({ message }) })
            }

            function basicDetails(user) {
                const { id, username, firstName, lastName } = user;
                return { id, username, firstName, lastName };
            }

            function basicListDetails(list) {
                const { id, todo} = list;
                return { id,todo };
            }

            function isAuthenticated() {
                return opts.headers['Authorization'] === 'Bearer fake-jwt-token';
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function headers() {
                return {
                    headers: {
                        get(key) {
                            return ['application/json'];
                        }
                    }
                }
            }
        });
    }
}

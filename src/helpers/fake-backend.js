export { fakeBackend };

// array in local storage for registered users
const listsKey = 'vue-3-pinia-registration-login-example-lists';
let lists = JSON.parse(localStorage.getItem(listsKey)) || [];

function fakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {  
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
            function createList() {
                const list = body();

                if (lists.find(x => x.todo === list.todo)) {
                    return error('todo "' + list.todo + '" is already created');
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
               
                console.log("All Todo list",lists);
                return ok(lists.map(x => basicListDetails(x)));
            }

            function getListsById() {
             

                const list = lists.find(x => x.id === idFromUrl());
                return ok(basicListDetails(list));
            }

            function updateList() {
             

                let params = body();
                let list = lists.find(x => x.id === idFromUrl());

                // if username changed check if taken
                if (params.todo !== list.todo && lists.find(x => x.todo === params.todo)) {
                    return error('todo "' + params.todo + '" is already created')
                }

                // update and save user
                Object.assign(list, params);
                localStorage.setItem(listsKey, JSON.stringify(lists));

                return ok();
            }

            function deleteList() {
             

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

            function basicListDetails(list) {
                const { id, todo} = list;
                return { id,todo };
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

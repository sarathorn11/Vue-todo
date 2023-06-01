import { Layout, List, AddEdit } from '@/views/lists';

export default {
    path: '/lists',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};

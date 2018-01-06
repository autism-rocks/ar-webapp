import i18n from 'locales/i18n';

// const ui = {
//     view: "submenu",
//     id: "userProfileMenu",
//     width: 200,
//     padding: 0,
//     data: [
//         // {id: 1, icon: "user", value: "My Profile"},
//         // {id: 2, icon: "cog", value: "My Account"},
//         // {id: 3, icon: "calendar", value: "My Calendar"},
//         // {id: 5, icon: "tasks", value: "My Tasks"},
//         {$template: "Separator"},
//         {
//             id: 'signoutMenu',
//             icon: "sign-out",
//             value: i18n.t('profile.menu.logout')
//         }
//     ],
//     on: {
//         onItemclick: function(menu) {
//             if (menu == 'signoutMenu') {
//                 webix.ajax('/ar/auth/logout').then(() => {
//                     this.$scope.app.show('/home');
//                 })
//             }
//         }
//     },
//     type: {
//         template: function (obj) {
//             if (obj.type)
//                 return "<div class='separator'></div>";
//             return "<span class='webix_icon alerts fa-" + obj.icon + "'></span><span>" + obj.value + "</span>";
//         }
//     }
// };

const ui = {
    view: "sidemenu",
    id: "userProfileMenu",
    width: 200,
    position: "right",
    state: function (state) {
        var toolbarHeight = 60;
        state.top = toolbarHeight;
        state.height -= toolbarHeight;
    },
    body: {

        view: "list",
        borderless: true,
        scroll: false,
        template: "<span class='webix_icon fa-#icon#'></span> #value#",
        data: [
            {
                id: 'add_participant',
                icon: "plus-circle",
                value: i18n.t('sidebar.add_participant.description')
            },
            {
                id: 'signoutMenu',
                icon: "sign-out",
                value: i18n.t('profile.menu.logout')
            }
        ],
        on: {
            onItemclick: function(menu) {
                if (menu == 'signoutMenu') {
                    webix.ajax('/ar/auth/logout').then(() => {
                        this.$scope.app.show('/home');
                    });
                } else {
                  this.$scope.show('/app/'+menu);
                }
            }
        },
        select: true,
        type: {
            height: 40
        }
    }
}

export default ui;

import i18n from 'locales/i18n';

const ui = {
    view: "sidemenu",
    id: "userProfileMenu",
    width: 300,
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
                value: i18n.t('sidebar.add_participant')
            },
            {
                id: 'edit_profile',
                icon: "pencil",
                value: i18n.t('sidebar.edit_profile')
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

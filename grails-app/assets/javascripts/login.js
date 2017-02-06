    function hide_un_hide_password() {
        var me = document.getElementById('password');
        var meType = me.getAttribute('type');
        if (meType == "password") {
                me.setAttribute('type', 'text');
                document.getElementById('password-word').innerHTML="Hide";
            }
        else {
                me.setAttribute('type', 'password');               
                document.getElementById('password-word').innerHTML="Show";
            }
      };

      function request_access () {

        window.open("http://www.pashiontool.com/beta#contact",'_blank');
      }

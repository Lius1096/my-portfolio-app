import React, { useEffect } from 'react';

const FacebookLogin = () => {
  useEffect(() => {
    /* Charger la bibliothèque Facebook */
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'YOUR_FACEBOOK_APP_ID',  // Remplacez par votre Facebook App ID
        cookie: true, 
        xfbml: true,  
        version: 'v16.0', 
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        console.log('Welcome! Fetching your information....');
        console.log(response);  // Obtenez le token d'authentification et envoyez-le à votre backend
        window.FB.api('/me', function (response) {
          console.log('Good to see you, ' + response.name + '.');
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <div>
      <button onClick={handleFacebookLogin}>Se connecter avec Facebook</button>
    </div>
  );
};

export default FacebookLogin;

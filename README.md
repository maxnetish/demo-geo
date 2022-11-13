# demo-geo
* [Typescript](https://www.typescriptlang.org)
* [Web components](https://developers.google.com/web/fundamentals/web-components/)
* [Preact](https://preactjs.com/)
* [Immutable](https://immutable-js.github.io/immutable-js/)
* [Leaflet](https://leafletjs.com/)

### api key
<https://developer.here.com/>

**development**: provide key in file `.HERE-api-secret.json`:

    {
      "apiKey": "KEY"
    }

**production environment**: api key should be added in proxy configuration of webserver. For example `nginx.conf`:

    location ~ ^/(?<apiservice>(autocomplete.search.hereapi.com))/(?<pathservice>.*)$  {
	  set $token "";
	  if ($is_args) {
	    set $token "&";
	  }
	  set $args "${args}${token}appKey=KEY"; # update args with $token

	  resolver 8.8.8.8;
      proxy_pass https://$apiservice/$pathservice$is_args$args;
      proxy_set_header Host $host;
	  proxy_redirect off;
    }


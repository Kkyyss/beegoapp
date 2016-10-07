<!-- Include the all sub components -->
{{ template "base/base.tpl" . }}
<!-- /Included -->
{{ define "add-on-css" }}
{{ end }}
{{ define "add-on-head-Js" }}
<script type="text/javascript">
	{{ if .Directory.IsLoginRegister }}
	var onloadCallback = function() {
	  LogRecap = grecaptcha.render('log-recap', {
	    'sitekey' : "{{.reCAPTCHA_SK}}",
	  });
	  RegRecap = grecaptcha.render('reg-recap', {
	    'sitekey' : "{{.reCAPTCHA_SK}}",
	  });
	};
	{{ end }}
</script>
{{ end }}
 
{{ define "body" }}
    <div id="app" class="universe"></div>
{{ end }}

{{ define "add-on-body-Js"}}
<script src="../static/js/build/bundle.js"></script>
	{{ if .Directory.IsLoginRegister }}
	<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=en" async defer></script>
	{{ else if .Directory.IsUserAccount }}
<!--   <script type="text/javascript" src="../static/js/build/initmap.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZL7ViUpezQtWj380V_gcI19tKDG5KdhE&libraries=places&language=en&callback=initMap" async defer></script> -->
	{{ end }}
{{ end }}

{{ define "after-base-js" }}
<!-- 	{{ if .Directory.IsLoginRegister }}
	{{ else if .Directory.IsForgotPassword }}
	{{ else if .Directory.IsResetPassword }}
	{{ else if .Directory.IsUser }}
	{{ end }}
	{{ if .Directory.IsUserAccount }}
	{{ end }}	 -->
{{ end }}

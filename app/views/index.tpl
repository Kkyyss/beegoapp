<!-- Include the all sub components -->
{{ template "base/base.tpl" . }}
<!-- /Included -->
{{ define "add-on-css" }}
{{ end }}
{{ define "add-on-head-Js" }}

{{ end }}
 
{{ define "body" }}
    <div id="app" class="universe"></div>
{{ end }}

{{ define "add-on-body-Js"}}
<script src="../static/js/build/bundle.js"></script>
{{ end }}

{{ define "after-base-js" }}
{{ end }}

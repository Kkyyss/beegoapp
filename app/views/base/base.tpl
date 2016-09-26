<!DOCTYPE html>
<html>
	<head>
		{{ template "base/head.tpl" .}}
		{{ define "meta" }}{{ end }}
		{{ define "favicon"}} {{ end }}
		<title>{{.Title}}</title>
		{{ define "base-css" }}{{ end }}
		{{ template "add-on-css" .}}
		{{ define "main-css" }}{{ end }}
		{{ template "add-on-head-Js" .}}
	</head>

	<body>
    <div class="preload"></div>	
		<div>
			{{ template "body" . }}
		</div>
		{{ template "add-on-body-Js" .}}		
		{{ template "base/footer.tpl" .}}
		{{ define "base-js" }}{{ end }}
		{{ template "after-base-js" .}}
	</body>
</html>







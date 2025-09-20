{{- define "service-inventory.fullname" -}}
{{- printf "%s" .Release.Name -}}
{{- end -}}

EMAILS=$(shell find views -name *.ejs)
DIRS=lib \
	lib/customer \
	lib/photographer

emailes: $(patsubst views/%,lib/%,$(EMAILS)) 

lib/%.ejs: views/%.ejs $(DIRS)
	@curl -X POST \
				-H 'Content-type: application/x-www-form-urlencoded' \
				--data-urlencode html\@$< 'https://templates.mailchimp.com/services/inline-css/' \
	> $@

$(DIRS):
	@mkdir -p $@
  
.PHONY: emails

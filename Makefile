# Build and deploy with custom commit message
# Usage: make push MSG="your commit message"

hugo:
	hugo
	git add . && git commit -m "update" && git push

push:
ifndef MSG
	$(error MSG is required. Usage: make push MSG="your commit message")
endif
	hugo --minify
	git add -A
	git commit -am "$(MSG)"
	git push


view = require './BlockSelector.html.js'

class BlockSelector
	state:
		selected: 'plain'
	constructor: (@container) ->
		# console.log "init"
		@container.innerHTML = view(@state)
		$(@container).find('button').click (e)=>
			@state.selected = e.srcElement.value



module.exports = BlockSelector
"use strict"

var o = require("../ospec/ospec")
var browserMock = require("../test-utils/browserMock")

o.spec("api", function() {
	var m
	var FRAME_BUDGET = Math.floor(1000 / 60)
	o.beforeEach(function() {
		var mock = browserMock()
		if (typeof global !== "undefined") global.window = mock, global.document = mock.document
		m = require("../mithril")
	})
	
	o.spec("m", function() {
		o("works", function() {
			var vnode = m("div")
			
			o(vnode.tag).equals("div")
		})
	})
	o.spec("m.version", function() {
		o("works", function() {
			o(typeof m.version).equals("string")
			o(m.version.indexOf(".") > -1).equals(true)
			o(/\d/.test(m.version)).equals(true)
		})
	})
	o.spec("m.trust", function() {
		o("works", function() {
			var vnode = m.trust("<br>")
			
			o(vnode.tag).equals("<")
			o(vnode.children).equals("<br>")
		})
	})
	o.spec("m.fragment", function() {
		o("works", function() {
			var vnode = m.fragment({key: 123}, [m("div")])
			
			o(vnode.tag).equals("[")
			o(vnode.key).equals(123)
			o(vnode.children.length).equals(1)
			o(vnode.children[0].tag).equals("div")
		})
	})
	o.spec("m.prop", function() {
		o("works", function() {
			var stream = m.prop(5)
			var doubled = stream.run(function(value) {return value * 2})
			
			o(doubled()).equals(10)
		})
		o("m.prop.combine works", function() {
			var added = m.prop.combine(function(a, b) {return a() + b()}, [
				m.prop(1),
				m.prop(2),
			])
			
			o(added()).equals(3)
		})
		o("m.prop.merge works", function() {
			var added = m.prop.merge([
				m.prop(1),
				m.prop(2),
			])
			.run(function(values) {return values[0] + values[1]})
			
			o(added()).equals(3)
		})
		o("m.prop.reject works", function() {
			var stream = m.prop.reject(new Error("error"))
			
			o(stream.error().message).equals("error")
		})
	})
	o.spec("m.withAttr", function() {
		o("works", function() {
			var spy = o.spy()
			var handler = m.withAttr("value", spy)
			
			handler({currentTarget: {value: 10}})
			
			o(spy.args[0]).equals(10)
		})
	})
	o.spec("m.parseQueryString", function() {
		o("works", function() {
			var query = m.parseQueryString("?a=1&b=2")
			
			o(query).deepEquals({a: 1, b: 2})
		})
	})
	o.spec("m.buildQueryString", function() {
		o("works", function() {
			var query = m.buildQueryString({a: 1, b: 2})
			
			o(query).equals("a=1&b=2")
		})
	})
	o.spec("m.render", function() {
		o("works", function() {
			var root = window.document.createElement("div")
			m.render(root, m("div"))
			
			o(root.childNodes.length).equals(1)
			o(root.firstChild.nodeName).equals("DIV")
		})
	})
	o.spec("m.mount", function() {
		o("works", function() {
			var root = window.document.createElement("div")
			m.mount(root, {view: function() {return m("div")}})
			
			o(root.childNodes.length).equals(1)
			o(root.firstChild.nodeName).equals("DIV")
		})
	})
	o.spec("m.route", function() {
		o("works", function(done) {
			var root = window.document.createElement("div")
			m.route(root, "/a", {
				"/a": {view: function() {return m("div")}}
			})
			
			setTimeout(function() {
				o(root.childNodes.length).equals(1)
				o(root.firstChild.nodeName).equals("DIV")
				
				done()
			}, FRAME_BUDGET)
		})
		o("m.route.prefix", function(done) {
			var root = window.document.createElement("div")
			m.route.prefix("#")
			m.route(root, "/a", {
				"/a": {view: function() {return m("div")}}
			})
			
			setTimeout(function() {
				o(root.childNodes.length).equals(1)
				o(root.firstChild.nodeName).equals("DIV")
				
				done()
			}, FRAME_BUDGET)
		})
		o("m.route.get", function(done) {
			var root = window.document.createElement("div")
			m.route(root, "/a", {
				"/a": {view: function() {return m("div")}}
			})
			
			setTimeout(function() {
				o(m.route.get()).equals("/a")
				
				done()
			}, FRAME_BUDGET)
		})
		o("m.route.set", function(done) {
			var root = window.document.createElement("div")
			m.route(root, "/a", {
				"/:id": {view: function() {return m("div")}}
			})
			
			setTimeout(function() {
				m.route.set("/b")
				o(m.route.get()).equals("/b")
				
				done()
			}, FRAME_BUDGET)
		})
	})
	o.spec("m.redraw", function() {
		o("works", function(done) {
			var count = 0
			var root = window.document.createElement("div")
			m.mount(root, {view: function() {count++}})
			setTimeout(function() {
				m.redraw()
				
				o(count).equals(2)
				
				done()
			}, FRAME_BUDGET)
		})
	})
	o.spec("m.request", function() {
		o("works", function() {
			o(typeof m.request).equals("function") // TODO improve
		})
		o("return value is stream", function() {
			o(m.request({method: "GET", url: "[invalid]"}).constructor).equals(m.prop().constructor)
		})
	})
	o.spec("m.jsonp", function() {
		o("works", function() {
			o(typeof m.jsonp).equals("function") // TODO improve
		})
	})
})
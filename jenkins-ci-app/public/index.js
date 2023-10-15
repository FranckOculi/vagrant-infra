let body = document.querySelector('.body')

let email = document.querySelector('#email')
let domain = document.querySelector('#domain')
let form = document.querySelector('#form')

let perPage = document.querySelector('#per_page')
let currentPage = document.querySelector('#current_page')

;(() => {
	let url = window.location.href.split('&')
	return (
		Array.isArray(url) &&
		url.map((e) => e.includes('per_page') && (perPage.value = e.split('=')[1]))
	)
})()
;(() => {
	let url = window.location.href.split('&')
	return (
		Array.isArray(url) &&
		url.map(
			(e) => e.includes('current_page') && (currentPage.value = e.split('=')[1])
		)
	)
})()

chrome.storage.sync.get(null, function (data) {
	for (const key in data) {
		$('#viewTable').append(`
            <tr>
				<td>${key}</td>
				<td><a href="${data[key].url}" target="_blank">${data[key].productName}</a></td>
				<td>${data[key].price}</td>
				<td>${data[key].updatedAt}</td>
			</tr>`)

		$('#hiddenTable').append(`
            <tr>
				<td>${key}</td>
				<td>${data[key].price}</td>
				<td>0</td>
			</tr>`)
	}
})

$('#clearAll').click(event => {
	chrome.storage.sync.clear(function () {
		alert('all data cleared')
		location.reload()
	})
})

$('#downloadCSV').click(function (event) {
	table2csv(this, 0)
})

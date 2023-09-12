$(document).ready(() => {
		$('.s-item').each((index, product) => {
				const CC = 1.35;

				const productId = $(product).attr('id');

				let currentPrice = $(product).find('.s-item__price').text();
				currentPrice = parseInt(currentPrice.replace(/\$/g, ''));
				let currentPriceSGD = Math.floor(currentPrice * CC);
				const currentPriceHTML = `<p class="currentPrice bold bidsold">SGD ${currentPriceSGD}</p>`;

				const input = `<input id='priceInput' name="${productId}" style='font-size: 24px;'>`;
				const price = `<p class='priceInUSD' style='color: black; font-size: 18px; font-weight: 600; color: red;'>USD <span class='priceInUSDValue'>0</span></p>`;

				// append the input into the product
				$(product).find('.s-item__details').prepend(input);
				// append the bidding price below the input
				$(product).find('#priceInput').after(price);
				// append current price below the USD price
				$(product).find('.s-item__price').after(currentPriceHTML);

				chrome.storage.sync.get(productId, function(data) {
						if (Object.keys(data).length === 0) {
								return;
						}

						$(product).find('#priceInput').val(Math.floor(Math.floor(data[productId].price * CC)));
						$($(product).find('.priceInUSDValue')[0]).text(
							Math.floor(data[productId].price)
						);
				});

				// event listener for the input box
				$(product)
					.find('#priceInput')
					.keyup(event => {
							let next;
							if (event.originalEvent.key == 'Enter' || event.originalEvent.key == 'ArrowDown') {
									next = $(product).next().find('#priceInput')[0] || 'end';
							}

							if (event.originalEvent.key == 'ArrowUp') {
									next = $(product).prev().find('#priceInput')[0] || 'end';
							}

							if (next) {
									if (next == 'end') return;

									const offset = $(next).offset();

									$(next).focus();
									$('html, body').animate(
										{
												scrollTop: offset.top - 200,
										},
										0
									);
									return;
							}

							if ($(product).hasClass('s-item__watchheart--watch')) {
									const watchButton = $(product).find('.s-item__watchheart-icon')[0];
									watchButton.click();
							}


							const price = Math.round($(product).find('#priceInput').val() / CC) || 0;
							const priceInUSD = price;
							$($(product).find('.priceInUSDValue')[0]).text(priceInUSD);

							if (price && price > currentPrice) {
									const now = new Date();

									const data = {
											updatedAt: now.toLocaleString(),
											price,
											productName: $(product).find('.s-item__title').text(),
											url: $(product).find('.s-item__link').attr('href'),
									};

									const toSet = {};
									toSet[productId] = data;

									chrome.storage.sync.set(toSet, function() {
											console.log('saved', data);
									});
							}

							if (price == 0 || price < currentPrice) {
									chrome.storage.sync.remove(productId);
							}
					});
		});
});


// $(document).ready(() => {
// 	$('.srp-results > li').each((index, product) => {
// 		const CC = 1.35
//
// 		const productId = $(product).attr('listingid')
//
// 		let currentPrice = $(product).find('.lvprice').text()
// 		currentPrice = parseInt(currentPrice.replace(/\$/g, ''))
// 		let currentPriceSGD = Math.floor(currentPrice * CC)
// 		const currentPriceHTML = `<p class="currentPrice bold bidsold">SGD ${currentPriceSGD}</p>`
//
// 		const input = `<input id='priceInput' name="${productId}" style='font-size: 24px;'>`
// 		const price = `<p class='priceInUSD' style='color: black; font-size: 18px; font-weight: 600; color: red;'>USD <span class='priceInUSDValue'>0</span></p>`
//
// 		// append the input into the product
// 		$(product).find('.lvprices > li:eq(0)').after(input)
// 		// append the bidding price below the input
// 		$(product).find('.lvprices input').after(price)
// 		// append current price below the USD price
// 		$(product).find('.lvprice').after(currentPriceHTML)
//
// 		chrome.storage.sync.get(productId, function (data) {
// 			if (Object.keys(data).length === 0) {
// 				return
// 			}
//
// 			$(product).find('#priceInput').val(Math.floor(Math.floor(data[productId].price * CC)))
// 			$($(product).find('.priceInUSDValue')[0]).text(
// 				Math.floor(data[productId].price)
// 			)
// 		})
//
// 		// event listener for the input box
// 		$(product)
// 			.find('#priceInput')
// 			.keyup(event => {
// 				// check if the keypress is Enter
// 				let next
// 				if (
// 					event.originalEvent.key == 'Enter' ||
// 					event.originalEvent.key == 'ArrowDown'
// 				) {
// 					next = $(product).next().find('#priceInput')[0] || 'end'
// 				}
//
// 				if (event.originalEvent.key == 'ArrowUp') {
// 					next = $(product).prev().find('#priceInput')[0] || 'end'
// 				}
//
// 				if (next) {
// 					if (next == 'end') return
//
// 					const offset = $(next).offset()
//
// 					$(next).focus()
// 					$('html, body').animate(
// 						{
// 							scrollTop: offset.top - 200,
// 						},
// 						0
// 					)
// 					return
// 				}
//
// 				// check on the watching
// 				const watchButton = $(product).find('.watch > a')[0]
//
// 				// only if its not watched yet, then click watch
// 				if ($(watchButton).text().trim() == 'Watch') {
// 					watchButton.click()
// 				}
//
// 				const price = Math.round($(product).find('#priceInput').val() / CC) || 0
// 				const priceInUSD = price
// 				$($(product).find('.priceInUSDValue')[0]).text(priceInUSD)
//
// 				if (price && price > currentPrice) {
// 					const now = new Date()
//
// 					const data = {
// 						updatedAt: now.toLocaleString(),
// 						price,
// 						productName: $(product).find('.lvtitle a').text(),
// 						url: $(product).find('.lvtitle a').attr('href'),
// 					}
//
// 					const toSet = {}
// 					toSet[productId] = data
//
// 					chrome.storage.sync.set(toSet, function () {
// 						console.log('saved', data)
// 					})
// 				}
//
// 				if (price == 0 || price < currentPrice) {
// 					chrome.storage.sync.remove(productId)
// 				}
// 			})
// 	})
// })

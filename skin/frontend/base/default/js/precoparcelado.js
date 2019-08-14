$pp = jQuery.noConflict();

$pp(document).ready(function() {

    Number.prototype.formatMoney = function(c, d, t) {
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    var getSimpleInterest = function(value, interest, parcels) {
	interest = interest / 100;
        var m = value * (1 + interest * parcels);
        var parcelValue = m / parcels;

        return parcelValue;
    };

    var getCompoundInterest = function(value, interest, parcels) {
	interest = interest / 100;
        var parcelValue = value * Math.pow((1 + interest), parcels);
        var parcelValue = parcelValue / parcels;
	
        return parcelValue;
    };

    var getPrice = function(value) {
        if (value > minParcel) {
            var finalText = '';
            var ppDecimalSymbol = optionsPrice.priceFormat.decimalSymbol;
            var ppCurrencyFormat = optionsPrice.priceFormat.pattern.replace('%s', '');
            var ppGroupSymbol = optionsPrice.priceFormat.groupSymbol;
            var finalText = '';
            var tableText = '';
            
            for (var i = 2; i <= maxNumberMonths; i++) {
                var parcel = 0;

                if (useCompound) {
                    parcel = getCompoundInterest(value, interest, i);
                } else {
                    parcel = getSimpleInterest(value, interest, i);
                }

                if (parcel >= minParcel) {
                    var parcelToCurrency = ppCurrencyFormat + (parcel).formatMoney(2, ppDecimalSymbol, ppGroupSymbol);
                    finalText = ppText.replace('{preco}', parcelToCurrency);
                    finalText = finalText.replace('{parcelas}', i);
                    
                    if (showTable) {
                        tableText += '<tr>';
                        tableText += '<td>' + ppTableText.replace('{parcelas}', i) + '</td>';
                        tableText += '<td>' + parcelToCurrency + '</td>';
                        tableText += '</tr>';
                    }
                }
            }
            
            $pp('.precoparcelado-parcels').html(finalText);
            $pp('.precoparcelado-table tbody').html(tableText);
        }

        return null;
    };

    var onPriceChange = function(e) {
        var ppTotalPrice = $pp('#product-price-' + ppId + ' span').html();
        var ppCurrencyFormat = optionsPrice.priceFormat.pattern.replace('%s', '');
        var ppDecimalSymbol = optionsPrice.priceFormat.decimalSymbol;
        var ppGroupSymbol = optionsPrice.priceFormat.groupSymbol;
        var ppCurrent = parseFloat(ppTotalPrice.replace(ppCurrencyFormat, '').replace(ppGroupSymbol, '').replace(ppDecimalSymbol, ','));

        getPrice(ppCurrent);
    };

    $pp('*[name^=super_attribute], *[name^=options]').on('change', onPriceChange);

});
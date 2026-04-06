var allProducts = [];

$(document).ready(function () {
    loadProducts();

    $('#addMoreButton').click(function () {
        addProductRow();
    });

    $('#saveOrder').click(function () {
        saveOrder();
    });
});

function loadProducts() {
    $.ajax({
        url: baseUrl + '/getProducts',
        type: 'GET',
        success: function (data) {
            allProducts = data;
            addProductRow();
        },
        error: function () {
            alert('Failed to load products. Make sure the server is running.');
        }
    });
}

function addProductRow() {
    var productBox = $('.product-box').clone();
    productBox.removeClass('hidden');

    var select = productBox.find('.cart-product');
    select.empty();
    for (var i = 0; i < allProducts.length; i++) {
        select.append('<option value="' + allProducts[i].product_id + '" data-price="' + allProducts[i].price_per_unit + '">' + allProducts[i].name + '</option>');
    }

    if (allProducts.length > 0) {
        var initialPrice = allProducts[0].price_per_unit;
        productBox.find('.product-price').val(initialPrice);
        productBox.find('.product-total').val(initialPrice);
    }

    select.change(function () {
        var price = $(this).find('option:selected').data('price');
        var qty = $(this).closest('.product-item').find('.product-qty').val();
        $(this).closest('.product-item').find('.product-price').val(price);
        $(this).closest('.product-item').find('.product-total').val((price * qty).toFixed(2));
        updateGrandTotal();
    });

    productBox.find('.product-qty').on('input change', function () {
        var price = $(this).closest('.product-item').find('.product-price').val();
        var qty = $(this).val();
        $(this).closest('.product-item').find('.product-total').val((price * qty).toFixed(2));
        updateGrandTotal();
    });

    productBox.find('.remove-row').click(function () {
        $(this).closest('.product-item').remove();
        updateGrandTotal();
    });

    $('#itemsInOrder').append(productBox);
    updateGrandTotal();
}

function updateGrandTotal() {
    var total = 0;
    $('#itemsInOrder .product-total').each(function () {
        total += parseFloat($(this).val()) || 0;
    });
    $('#product_grand_total').val(total.toFixed(2));
}

function saveOrder() {
    var customerName = $('#customerName').val().trim();
    if (!customerName) {
        alert('Please enter customer name.');
        return;
    }

    var orderDetails = [];
    $('#itemsInOrder .product-item').each(function () {
        orderDetails.push({
            product_id: $(this).find('.cart-product').val(),
            quantity: $(this).find('.product-qty').val(),
            total_price: $(this).find('.product-total').val()
        });
    });

    if (orderDetails.length === 0) {
        alert('Please add at least one product.');
        return;
    }

    var order = {
        customer_name: customerName,
        grand_total: $('#product_grand_total').val(),
        order_details: orderDetails
    };

    $.ajax({
        url: baseUrl + '/insertOrder',
        type: 'POST',
        data: { data: JSON.stringify(order) },
        success: function (response) {
            alert('Order saved! Order ID: ' + response.order_id);
            window.location.href = 'index.html';
        },
        error: function () {
            alert('Failed to save order.');
        }
    });
}

$(document).ready(function () {
    loadProducts();
    loadUoms();

    $('#saveProduct').click(function () {
        saveProduct();
    });
});

function loadProducts() {
    $.ajax({
        url: baseUrl + '/getProducts',
        type: 'GET',
        success: function (data) {
            var tableBody = $('table tbody');
            tableBody.empty();
            for (var i = 0; i < data.length; i++) {
                var row = '<tr>' +
                    '<td>' + data[i].name + '</td>' +
                    '<td>' + data[i].uom_name + '</td>' +
                    '<td>' + data[i].price_per_unit + '</td>' +
                    '<td>' +
                        '<button class="btn btn-sm btn-danger" onclick="deleteProduct(' + data[i].product_id + ')">Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(row);
            }
        },
        error: function () {
            alert('Failed to load products. Make sure the server is running.');
        }
    });
}

function loadUoms() {
    $.ajax({
        url: baseUrl + '/getUOM',
        type: 'GET',
        success: function (data) {
            var uomSelect = $('#uoms');
            uomSelect.empty();
            for (var i = 0; i < data.length; i++) {
                uomSelect.append('<option value="' + data[i].uom_id + '">' + data[i].uom_name + '</option>');
            }
        }
    });
}

function saveProduct() {
    var productName = $('#name').val().trim();
    var uomId = $('#uoms').val();
    var price = $('#price').val().trim();

    if (!productName || !price) {
        alert('Please fill in all fields.');
        return;
    }

    var data = {
        product_name: productName,
        uom_id: uomId,
        price_per_unit: price
    };

    $.ajax({
        url: baseUrl + '/insertProduct',
        type: 'POST',
        data: { data: JSON.stringify(data) },
        success: function (response) {
            $('#productModal').modal('hide');
            loadProducts();
            $('#productForm')[0].reset();
        },
        error: function () {
            alert('Failed to save product.');
        }
    });
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    $.ajax({
        url: baseUrl + '/deleteProduct',
        type: 'POST',
        data: { product_id: productId },
        success: function (response) {
            loadProducts();
        },
        error: function () {
            alert('Failed to delete product.');
        }
    });
}

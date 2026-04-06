$(document).ready(function () {
    loadOrders();
});

function loadOrders() {
    $.ajax({
        url: baseUrl + '/getAllOrders',
        type: 'GET',
        success: function (data) {
            var tableBody = $('table tbody');
            tableBody.empty();
            for (var i = 0; i < data.length; i++) {
                var dt = new Date(data[i].datetime);
                var formattedDate = dt.toLocaleDateString();
                var row = '<tr>' +
                    '<td>' + formattedDate + '</td>' +
                    '<td>' + data[i].order_id + '</td>' +
                    '<td>' + data[i].customer_name + '</td>' +
                    '<td>' + data[i].total + '</td>' +
                    '</tr>';
                tableBody.append(row);
            }
        },
        error: function () {
            alert('Failed to load orders. Make sure the server is running.');
        }
    });
}

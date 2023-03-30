// $(document).ready( function () {
//     $('#myTable').DataTable();
//     $('#sknConfigTable').DataTable();
//     $('#sknCalibrateTable').DataTable();
//     $('#sknReferenceTable').DataTable();
//     $('#sknCognitiveTable').DataTable();
//     $('#table0911221129').DataTable();
// } );

// $('#myTable').DataTable( {
//     info: false,
//     // scrollX: true
// } );

// $('#sknConfigTable').DataTable( {
//     info: false,
//     // scrollX: true
// } );

// $('#sknCalibrateTable').DataTable( {
//     info: false,
//     // scrollY: 566,
//     // scrollX: true
// } );

// $('#sknReferenceTable').DataTable( {
//     info: false,
//     // scrollY: 566,
//     // scrollX: true
// } );

// $('#sknCognitiveTable').DataTable( {
//     info: false,
//     // scrollY: 566,
//     // scrollX: true
// } );

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// $(function() {

//     var start = moment().subtract(29, 'days');
//     var end = moment();

//     function cb(start, end) {
//         $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//     }

//     $('#reportrange').daterangepicker({
//         startDate: start,
//         endDate: end,
//         ranges: {
//            'Today': [moment(), moment()],
//            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//            'This Month': [moment().startOf('month'), moment().endOf('month')],
//            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//         }
//     }, cb);

//     cb(start, end);

// });

function thumbShowHide(){
    if(document.getElementById("skn-review-thumbnails").style.display=="block"){
        document.getElementById("skn-review-thumbnails").style.display="none";
        document.getElementById("skn-review-thumbnails-title").style.display="none";
    }
    else{
        document.getElementById("skn-review-thumbnails").style.display="block";
        document.getElementById("skn-review-thumbnails-title").style.display="block";
    }
}

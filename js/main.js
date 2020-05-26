$( document ).ready(function() {
    var response;
    function  progressClass(deal){
      if (deal.progressName == "Approval") {
        return 'approval';
      } else if(deal.progressName == "Underwriting") {
        return 'underwriting';
      } else if(deal.progressName == "Application") {
        return 'application';
      }
    }
    function renderTable(deals){
      var table = "<tr><th>name</th><th>progress</th><th>type</th><th>amount</th><th>contact</th><th>created</th><th>last modified</th></tr>"

      deals.forEach(function(deal){
        table += "<tr>"+"<td  class='bold'>" + deal.name + "</td>"
        + "<td>" + "<div class='"+ progressClass(deal) +"'>" + deal.progressName + "</td>" +
        "<td>" + deal.typeName + "</td>" +
        "<td class='bold'>" + "$ " + deal.amount.toLocaleString('en') + "</td>" +
        "<td class='img-text'><img src='images/" + deal.contactPhoto + ".jpg'" + "alt='" + deal.contactName + "' class='table-img'/>" + deal.contactName + "</td>" +
        "<td>" + deal.dateCreated + "</td>" + "<td>" + deal.dateModified + "</td>"+"</tr>";
      });
      $('#table-content')[0].innerHTML = table;
    }

    function renderDealList(response){
      var listDealsType = "<option value=''>All types</option>";
      response.dealTypes.forEach(function(types){
        listDealsType += "<option value='" + types.name +"'>"+types.name +"</option>";
      });
      $('#deals-list')[0].innerHTML = listDealsType;
    };
    function renderScore(response){
      $('#borrowed span')[0].innerHTML = "$" + response.borrowed.toLocaleString('en');
      $('#profit span')[0].innerHTML = "$" + response.annualProfit.toLocaleString('en');
      $('#lead span')[0].innerHTML = response.conversion + " " + "%" ;
      $('#avg')[0].innerHTML = "$" + response.averageIncome.toLocaleString('en');
    }


    $.ajax({
        url: "/headchannel/data.json",
        dataType: "json"
    }).done(function(r){
      response = r;
      renderScore(r);
      renderTable(r.deals);
      renderDealList(r);
    }).fail(function(error){
      console.log(error);
    });

    var o = $('#deals-list');
    o.change(function() {
      var type = o.val();

      if (type === "") {
        renderTable(response.deals);
        return;
      }

      var deals = [];
      for (var i = 0; i < response.deals.length; i++) {
        if (response.deals[i].typeName === type) {
          deals.push(response.deals[i]);
        }
      }
      renderTable(deals);
    });
});

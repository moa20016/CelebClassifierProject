Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000/classify_image";

        // var url = "/api/classify_image";
    
        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
    
            let players = ["srk", "hrithik_roshan", "muhammad_ali", "khabib", "tobey"];
            
            let matches = [];
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    matches = [data[i]];
                    bestScore = maxScoreForThisClass;
                } else if (maxScoreForThisClass==bestScore) {
                    matches.push(data[i]);
                }
            }
            if (matches.length > 0) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
            
                $("#resultHolder").empty(); // Clear previous results
            
                for (let match of matches) {
                    let playerName = match.class;
                    let playerImage = $(`[data-player="${playerName}"]`).html();
                    $("#resultHolder").append(playerImage);
                }
            
                let classDictionary = matches[0].class_dictionary; // Assuming class_dictionary is the same for all matches
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = matches[0].class_probability[index]; // Using the first match's probability score
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }            
        });
    });
    

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});
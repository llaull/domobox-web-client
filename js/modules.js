var instantane;

$(document).ready(function() {

    //
    var code = function(i) {

        //appel la generation du fichier json en local
        $.get("modules/json_/class.json.php", {
            Options: "none"
        });

        //lit le fichier json
        $.ajax({
            url: 'resources.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {

                if (instantane != null) {

                    for (var i = 0; i < data.length; i++ || data.length != instantane.length) {

                        if (data[i].sonde_valeur != instantane[i].sonde_valeur) {

                            //met a jour l'element qui en a bessoin
                            if (data[i].sonde_valeur < instantane[i].sonde_valeur) {
                                console.log(data[i].sonde_valeur + " dans " + data[i].module_id);
                            }

                            creatHTML(i, data);

                        }
                    }
                } else {
                    //charge les conteneur
                    creatHTML("NaN", data);

                }

                instantane = data;

            }
        }); // fin fonction ajax
    }; //fin fonction code


    //applique le filtre
    $("#filtre").change(function() {

        $('#filtre input:checkbox').each(function() {

            var attr = "";
            var nom = $(this).attr("name");
            var attr = $(this).attr("checked");

            //si checkbox est checked 
            if (attr == "checked") {
                //creation d'un cookies au nom du l'element en true
                $.cookie(nom, "true", {
                    expires: 17,
                    path: '/'
                });

                //affichage des elements a true
                for (var j = 0; j < instantane.length; j++) {

                    if (instantane[j].module_emplacement == nom)
                        $("#" + instantane[j].module_id + "_" + instantane[j].sonde_type + "_" + instantane[j].sonde_unit).show();

                }
                $("#_" + nom).show();


            } else {
                //sinon le cookies prends false
                $.cookie(nom, "false", {
                    expires: 1,
                    path: '/'
                });

                //masquage des elements a true
                for (var j = 0; j < instantane.length; j++) {

                    if (instantane[j].module_emplacement == nom || instantane[j].nom_lien == nom || instantane[j].nom_sensor == nom)
                        $("#" + instantane[j].module_id + "_" + instantane[j].sonde_type + "_" + instantane[j].sonde_unit).hide();

                }
                $("#_" + nom).hide();

            }

        });

    });

    // effectue un check du json toute les 10s
    $(document).everyTime("10s", code, 0);

    //charge le json Ã  l'ouverture de la page
    code("");

    //cree les elements html
    var codeBaliseModule = function(index, element, truc) {


        if (truc == 1) {

            //id div
            return element[index].module_id + "_" + element[index].sonde_type + "_" + element[index].sonde_unit;


        } else {
            if (element[index].nom_sensor == "RubanRGB") {

                //div special ruban RGV
                return "<li class=\"modules_fond " + element[index].nom_lien + " " + element[index].nom_sensor + "\">" + "<div class=\"titre modules_fond\"><span>" + "Ambianceur RGB" + "</span>" + "<a href=\"configuration/" + element[index].module_id + "/\"><i class=\"icon-cog\"></i></a>" + "</div>" + "<div class=\"TinyColorConteneur\">" + "<a class=\"color\"><div class=\"colorInner\"></div></a>" + "<div class=\"track\"></div>" + "<ul class=\"dropdown\"><li></li></ul>" + "<input type=\"hidden\" class=\"colorInput\" value=\"#66B032\" />" + "<input type=\"hidden\" class=\"moduleID\" value=\"" + element[index].module_id + "\" />" + "</div>" + "<div><a href=\"#\" class=\"submit\">Off</a><br></div></li>";

            } else {

                //contenu du div
                return "<li class=\"modules_fond " + element[index].nom_lien + " " + element[index].nom_sensor + "\">" + "<div class=\"titre modules_fond\"><span>" + element[index].nom_lien + "</span>" + "<a href=\"configuration/" + element[index].module_id + "/\"><i class=\"icon-cog\"></i></a>" + "</div>" + "<p><span>" + element[index].sonde_valeur + "</span></p></li>";

            }

        }

    }

    // permet de netoyer les doublons dans un tableau
    function cleanArray(array) {
        var i, j, len = array.length,
            out = [],
            obj = {};
        for (i = 0; i < len; i++) {
            obj[array[i]] = 0;
        }
        for (j in obj) {
            out.push(j);
        }
        return out;
    }

    //gestion des elements
    var creatHTML = function(index, element) {

            var tableauLieu = [];
            var tableauSonde = [];
            var tableauNomSensor = [];

            //tableau des lieux
            for (var i = 0; i < element.length; i++) {

                tableauLieu[i] = element[i].module_emplacement;

            }

            for (var i = 0; i < element.length; i++) {

                tableauSonde[i] = element[i].nom_lien;

            }

            for (var i = 0; i < element.length; i++) {

                tableauNomSensor[i] = element[i].nom_sensor;

            }

            //suppression des doublons dans le tableaux  
            var tableauLieu = cleanArray(tableauLieu);
            var tableauSonde = cleanArray(tableauSonde);
            var tableauNomSensor = cleanArray(tableauNomSensor);

            if (index == "NaN") {
                // affiche les elements du menu de gauche
                for (var i = 0; i < tableauNomSensor.length; i++) {
                    var checked = "";

                    if ($.cookie(tableauNomSensor[i]) == "true" || $.cookie(tableauNomSensor[i]) == undefined) {
                        var checked = 'checked="checked"'
                    }

                    $('#filtre').prepend('<input type="checkbox" id="' + tableauNomSensor[i] + '" name="' + tableauNomSensor[i] + '" value="ON" ' + checked + '> ' + tableauNomSensor[i] + '' + "<br>");
                }

                for (var i = 0; i < tableauSonde.length; i++) {
                    var checked = "";

                    if ($.cookie(tableauSonde[i]) == "true" || $.cookie(tableauSonde[i]) == undefined) {
                        var checked = 'checked="checked"'
                    }
                    $('#filtre').prepend('<input type="checkbox" id="' + tableauSonde[i] + '" name="' + tableauSonde[i] + '" value="ON" ' + checked + '> ' + tableauSonde[i] + '' + "<br>");
                }

                for (var i = 0; i < tableauLieu.length; i++) {
                    var checked = "";

                    if ($.cookie(tableauLieu[i]) == "true" || $.cookie(tableauLieu[i]) == undefined) {
                        var checked = 'checked="checked"'
                    }

                    $('#filtre').prepend('<input type="checkbox" id="' + tableauLieu[i] + '" name="' + tableauLieu[i] + '" value="ON" ' + checked + '> ' + tableauLieu[i] + '' + "<br>");
                }



                // boucle qui liste les lieux
                for (var i = 0; i < tableauLieu.length; i++) {

                    var module = $("<h2 id='_" + tableauLieu[i] + "'>").html(tableauLieu[i]);

                    if ($.cookie(tableauLieu[i]) == "false") {
                        module.hide();
                    }

                    //remplir le conteneur a modules         
                    $('#modules').append(module);

                    //boucle qui liste les sondes du lieu
                    for (var j = 0; j < element.length; j++) {

                        if (tableauLieu[i] == element[j].module_emplacement) {

                            var module = $("<span id='" + codeBaliseModule(j, element, 1) + "'>").html(codeBaliseModule(j, element, 2));

                            // remplir le conteneur a modules         
                            $('#modules').append(module);

                            //Active le colorPicker
                            var $box = $('.TinyColorConteneur');
                            var box = $box.tinycolorpicker();

                            $box.bind("change", function() {

                                var selectedValue = $(this).find(".colorInput").val();

                                var moduleID = $(this).find(".moduleID").val();

                                console.log(" >: " + selectedValue + " & " + moduleID);
                                //$("body").append('<iframe allowtransparency="true" scrolling="no" id="frame" name="frame" src="http://stockage.llovem.eu:8227/?module=' +
                                // moduleID + '&action='+selectedValue+'" seamless ></iframe>');
                            });


                            //masque les elements
                            if ($.cookie(tableauLieu[i]) == "false" || $.cookie(element[j].nom_lien) == "false" || $.cookie(element[j].nom_sensor) == "false") {
                                $("#" + codeBaliseModule(j, element, 1)).hide();
                            }

                        }

                    }

                }
            } else {

                //met a jours ici si modification de l element      
                $('#' + codeBaliseModule(index, element, 1)).html(codeBaliseModule(index, element, 2));

            }

        } //fin fonction creatHTML

}); //fin ready
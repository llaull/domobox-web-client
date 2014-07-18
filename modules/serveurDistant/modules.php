<?php
//extract($_POST);


header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json; charset=utf-8');
// on se connecte à notre base  pour recuperer les data
$base = mysql_connect ('localhost', 'laurent', '');  
mysql_select_db ('app_domobox', $base) ;  
$req =mysql_query("SELECT  
s.id, s.module_id,
s.valeur_temp AS date, 
s.sonde_unit, 
s.sonde_type, 
s.sonde_valeur, 
m.module_nom, 
m.module_type, 
m.module_ref, 
m.module_emplacement, 
u.nom_lien, 
t.nom AS nom_sensor 
FROM domotic_sensor AS s 
INNER JOIN (SELECT module_id, sonde_unit, sonde_type, max(valeur_temp) AS max_temp 
       FROM domotic_sensor WHERE valeur_temp > CURDATE()
	   GROUP BY module_id, sonde_unit, sonde_type ) AS b ON b.module_id=s.module_id AND b.sonde_unit = s.sonde_unit AND b.sonde_type = s.sonde_type AND b.max_temp = s.valeur_temp
LEFT JOIN domotic_sensor_module AS m ON s.module_id = m.module_ref 
LEFT JOIN sensor_unit AS u ON s.sonde_unit = u.unit_id
LEFT JOIN sensor_type AS t ON s.sonde_type = t.type_id 
WHERE s.valeur_temp > CURDATE() 
AND t.nom IS NOT NULL
AND t.nom <> 'systeme'
ORDER BY module_id, sonde_type");

while ($row=mysql_fetch_array($req)) 
{    
    $output[]=$row;
} 

print json_encode($output);

?>

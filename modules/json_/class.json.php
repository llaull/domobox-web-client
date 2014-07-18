<?php

class Modules{
	var	$url = 'http://stockage.llovem.eu/api/domobox/modules.php';
	//var	$proxy = '10.127.254.1:80';	
	var $c_nom = "../../resources.json";
	var $c_path = '';
	var $c_lifetime = 5;
	var $errors = array();



	/*function __construct(){
		
		$this->load();
	}*/

	/**
	 * Charge les données (du cache ou du serveur) dans un txt
	 */
	public function load(){

		if(file_exists($this->c_path.$this->c_nom) )
		{
			//fichier present
			
			$stat = stat($this->c_path.$this->c_nom);

			if(time() > ($stat['mtime'] - ($this->c_lifetime * 60)))
			{			
				$data = $this->file_get_contents_curl();
				
				if(isset($data) && ($data === false || empty($data)))
				{

					$msg = 'Erreur lors du chargement.';

				} else
				{

					file_put_contents($this->c_nom,$data);
					$msg = "mis a jour".time()." _ ".$stat['mtime']." _ ".$this->c_lifetime * 60;

				}
				


			}


		} else {
			//fichier manquant
			$msg = "manquant";
			$data = $this->file_get_contents_curl();
			file_put_contents($this->c_nom,$data);

		}

		//return $msg;

	}



	/**
	 * Charge les données depuis le fichier json (sur serveur distant) via cURL
	 * @return string
	 */
	public function file_get_contents_curl() {

		//$proxyauth = 'user:password';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$this->url);
		//curl_setopt($ch, CURLOPT_PROXY, $this->proxy);
		//curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$curl_scraped_page = curl_exec($ch);
		curl_close($ch);

		return $curl_scraped_page;
	}

}
$tw = new Modules();
echo $tw->load();


?>
<?

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	if($data['type']=="find_company"){
	    $query="SELECT * FROM Companies WHERE ";
	    $index=0;
	    foreach ($data['values'] as $value){
	        if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="companies"){
	            if($index>0) $query.=" AND ";
	            $query.="LOWER(".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	        else if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="addresses"){
	            $addresses=true;
	            $query_addresses="SELECT * FROM addresses WHERE LOWER(Street) RLIKE LOWER('".$value["val"]."') OR LOWER(City) RLIKE LOWER('".$value["val"]."')OR LOWER(Region) RLIKE LOWER('".$value["val"]."') OR LOWER(Country) RLIKE LOWER('".$value["val"]."')";
	        }
	    }
	    if($companies)$result = mysql_query($query) or die();
	    if($companies && $addresses){

	    }
        $resultJson = array();
        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           $resultJson[] = $row;
        }
        echo json_encode($resultJson);
	}
	/*foreach ($data as $mass_item) {
        if($mass_item['name']=="Наименование" && isset($mass_item['val'])) $exp=$mass_item['val'];
	}
	$query = "SELECT * FROM Companies WHERE LOWER(name) RLIKE LOWER('".$exp."') ";
    $result = mysql_query($query) or die();
    $resultJson = array();
    while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
        //var_dump($row);
       $resultJson[] = $row;
    }
    echo json_encode($resultJson);
*/



?>
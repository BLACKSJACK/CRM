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
	            $query.="LOWER(Companies.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	    }
        $result = mysql_query($query) or die();
        $resultJson = array();
        $query="SELECT * FROM addresses WHERE id in (";
        $index=0;
        $query_for_contacts="SELECT * FROM connections WHERE id in (";
        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
            if($index>0){
                $query.=", ";
                $query_for_contacts.=", ";
            }
            $query_for_contacts.=$row['id'];
            $query.=$row['Legal_address'];
            $index++;
            $resultJson[] = $row;
        }
        $query.=")";
        $query_for_contacts.=")";
        $result=mysql_query($query) or die();
        $addresses=array();
        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           $addresses[$row['id']] = $row['City'].", ".$row['Street'];

        }
        $result=[];
        foreach($resultJson as $row){

            $id=$row['Legal_address'];
            $row['Legal_address']=$addresses[$id];
            //echo $row['Legal_address'];
            $result[]=$row;

        }
        //$result=mysql_query($query) or die();



        echo json_encode($result);
        $resultJson=[];

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


<?

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	if($data['type']=="find_company"){


	    $query="SELECT com.name, ctx.LastName, ctx.FirstName, com.company_phone ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    //$query.="LEFT JOIN Addresses as add on add.id = com.Legal_address ";
	    $query.="WHERE ";
	    $index=0;
	    foreach ($data['values'] as $value){
	        if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="companies"){
	            if($index>0) $query.=" AND ";
	            $query.="LOWER(com.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	    }
        //echo $query;
        $result = mysql_query($query) or die(mysql_error());
        $resultJson = array();

        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           //$addresses[$row['id']] = $row['City'].", ".$row['Street'];
           $resultJson[]=$row;


        }

        echo json_encode($resultJson);


	}







?>


<?

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	if($data['type']=="find_company"){


	    $query="SELECT com.name, ctx.LastName, ctx.FirstName, com.company_phone,add.City, add.Street ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    $query.="LEFT JOIN Addresses as add on add.id = com.Legal_address ";
	    $query.="WHERE ";
	    $index=0;
	    foreach ($data['values'] as $value){
	        if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="companies"){
	            if($index>0) $query.=" AND ";
	            $query.="LOWER(com.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	    }
        echo $query;
        $result = mysql_query($query) or die(mysql_error());
        $resultJson = array();

        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           //$addresses[$row['id']] = $row['City'].", ".$row['Street'];
           $resultJson[]=$row;


        }

        //echo json_encode($resultJson);


	}







?>
<?//рабочий вариант

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	if($data['type']=="find_company"){


	    $query="SELECT com.name, ctx.LastName, ctx.FirstName, com.company_phone,addr.City, addr.Street ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    $query.="LEFT JOIN addresses as addr on addr.id = com.Legal_address ";
	    $query.="WHERE ";
	    $index=0;
	    foreach ($data['values'] as $value){
	        if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="companies"){
	            if($index>0) $query.=" AND ";
	            $query.="LOWER(com.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	    }
        //echo $query;
        $result = mysql_query($query) or die(mysql_error());
        $resultJson = array();

        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           //$addresses[$row['id']] = $row['City'].", ".$row['Street'];
           $resultJson[]=$row;


        }

        echo json_encode($resultJson);


	}







?>

<?//рабочий вариант

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	if($data['type']=="find_company"){


	    $query="SELECT com.name, ctx.LastName, ctx.FirstName, com.company_phone,addr.City, addr.Street ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    $query.="LEFT JOIN addresses as addr on addr.id = com.Legal_address ";
	    $query.="WHERE ";
	    $index=0;
	    foreach ($data['values'] as $value){
	        if(isset($value["val"]) && $value["val"]!="" && $value["db"]=="companies"){
	            if($index>0) $query.=" AND ";
	            $query.="LOWER(com.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	            $index++;
	            $companies=true;
	        }
	    }
        //echo $query;
        $result = mysql_query($query) or die(mysql_error());
        $resultJson = array();

        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           //$addresses[$row['id']] = $row['City'].", ".$row['Street'];
           $resultJson[]=$row;


        }

        echo json_encode($resultJson);


	}







?>
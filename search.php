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








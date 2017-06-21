<?//рабочий вариант

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	$value=$data['value'];
	if($data['type']=="find_company"){


	    $query="SELECT com.name, ctx.LastName, ctx.FirstName, com.company_phone,addr.City, addr.Street ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    $query.="LEFT JOIN addresses as addr on addr.id = com.Legal_address ";
	    //$query.="WHERE LOWER(".$data['value']['as'].".".$data['value']['model'].") RLIKE LOWER('".$data['value']['val']."')";

	    if($value['db']=='companies') $query.="WHERE LOWER(com.".$value['model'].") RLIKE LOWER('".$value['val']."')";
	    else if($value['db']=='contacts') $query.="WHERE LOWER(ctx.FirstName) RLIKE LOWER('".$value['val']."') OR LOWER(ctx.LastName) RLIKE LOWER('".$value['val']."')";
        else if($value['db']=='addresses') $query.="WHERE LOWER(addr.City) RLIKE LOWER('".$value['val']."') OR LOWER(addr.Street) RLIKE LOWER('".$value['val']."')";
        //echo $query;
        $result = mysql_query($query) or die(mysql_error());
        $resultJson = array();

        while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
           //$addresses[$row['id']] = $row['City'].", ".$row['Street'];
           $resultJson[]=$row;


        }
        $array=[];
        foreach($resultJson as $key=>$value){
            $resultJson[$key]['contact']=$resultJson[$key]['FirstName']." ".$resultJson[$key]['LastName'];
            unset($resultJson[$key]['LastName']);
            unset($resultJson[$key]['FirstName']);
            $resultJson[$key]['Legal_address']=$resultJson[$key]['City']." ".$resultJson[$key]['Street'];
            unset($resultJson[$key]['City']);
            unset($resultJson[$key]['Street']);
        }

        echo json_encode($resultJson);


	}








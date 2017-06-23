<?

    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
	$value=$data['value'];
	if($data['type']=="find_company"){


	    $query="SELECT com.id, com.name, ctx.LastName, ctx.FirstName, com.company_phone, addr.City, addr.Street ";
	    $query.="FROM Connections as con ";
	    $query.="LEFT JOIN Companies as com on con.company_id = com.id ";
	    $query.="LEFT JOIN Contacts as ctx on con.contact_id = ctx.id ";
	    $query.="LEFT JOIN addresses as addr on addr.id = com.Legal_address ";
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

        foreach($resultJson as $key=>$value){
            $resultJson[$key]['contact']=$resultJson[$key]['FirstName']." ".$resultJson[$key]['LastName'];
            unset($resultJson[$key]['LastName']);
            unset($resultJson[$key]['FirstName']);
            $resultJson[$key]['Legal_address']=$resultJson[$key]['City']." ".$resultJson[$key]['Street'];
            unset($resultJson[$key]['City']);
            unset($resultJson[$key]['Street']);
        }
        $array=[];
        foreach($resultJson as $item){
            if(!isset($array[$item['id']])){
                $array[$item['id']]=$item;
                if(isset($item['company_phone'])){
                    $mass=explode(";", $item['company_phone']);
                    $array[$item['id']]['company_phone']=[];
                    foreach($mass as $mass_item){
                        if(isset($mass_item) && $mass_item!="") $array[$item['id']]['company_phone'][]=$mass_item;
                    }
                }
                if(count($array[$item['id']]['company_phone'])==0) $array[$item['id']]['company_phone']="";
                else if(count($array[$item['id']]['company_phone'])==1) $array[$item['id']]['company_phone']=$array[$item['id']]['company_phone'][0];
            }
            else{
                if(is_array($array[$item['id']]['contact'])) $array[$item['id']]['contact'][]=$item['contact'];
                else{
                    $array[$item['id']]['contact']=[$array[$item['id']]['contact']];
                    $array[$item['id']]['contact'][]=$item['contact'];;
                }
            }

        }
        $resultJson=[];
        foreach($array as $item){
            $resultJson[]=$item;
        }
        echo json_encode($resultJson);
        //echo json_encode($array);


	}

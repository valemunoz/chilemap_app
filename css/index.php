<?php
include("../includes/funciones.php");
require_once("includes/Mobile_Detect.php");
$estado_sesion=estado_sesion();
$CM_path_base2="http://localhost/chilemap_html/index_mapa.php";
//$CM_path_base2="http://www.chilemap.cl/index_mapa.php";


$meta = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR']));
$latitud = $meta['geoplugin_latitude'];
$longitud = $meta['geoplugin_longitude'];
$ciudad = $meta['geoplugin_city'];
if(is_numeric($latitud) and is_numeric($longitud) and $latitud!=0 and $longitud!=0)
{
	?>
	<script>
		LAT_INI="<?=$latitud?>";
		LON_INI="<?=$longitud?>";
		
	</script>
	<?php
}
$detect = new Mobile_Detect;
$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'computer');
$data_server= explode("?",$_SERVER['REQUEST_URI']);
if($deviceType=="computer")
{
	?>
		<script>
			//window.location="<?=$CM_path_base2?>?<?=$data_server[1]?>";
	</script>
	<?php
	
}

?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title>Chilemap</title>
        <link rel="shortcut icon" href="images/icon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
				<meta name="author" content="Chilemap.cl" />     
         <link rel="stylesheet" href="css/themes/theme.css" />
  			<link rel="stylesheet" href="css/themes/jquery.mobile.icons.min.css" />
        <link rel="stylesheet" href="css/jquery.mobile.structure-1.4.0-rc.1.min.css" />
        <script src="js/jquery-1.10.2.min.js"></script> 
				<script src="js/jquery.mobile-1.4.0-rc.1.min.js"></script> 
				<link rel="stylesheet" href="css/style.mobile.css" type="text/css">
        <link rel="stylesheet" href="css/style.mobile-jq.css" type="text/css">  			
   			<link rel="stylesheet" href="css/style.css" />
   			<script type="text/javascript" src="http://www.chilemap.cl/OpenLayers/OpenLayers.js"></script>           			
        <script src="js/funciones_api_mobile.js"></script>
   			<script src="js/funciones.js"></script> 
    </head>
    <body onload="loadMapa();deviceListo();">
    <div data-role="page" id="mappage" data-theme="a">
		    	<div data-role="panel" id="mypanel" data-theme="a" style="z-index:99999;" data-position="right" data-display="overlay">
    	  		<a href="#mypanel" data-iconpos="top" data-rel="close" data-icon="delete" data-role="button" data-iconpos="notext"></a>
    			
			  	  <div data-role="collapsible" data-collapsed="false" >
    				  <h3>Men&uacute;</h3>
							<ul data-role="listview" data-inset="false">
    	  	  			
    	  	  		<li id="ll_iniciar"><a href="#mod_sesion" data-rel="dialog" data-transition="pop" >Iniciar Sesion</a></li>	
    	  	  		<li id="ll_reg"><a href="#mod_registro" data-rel="dialog" data-transition="pop" >Registrate!</a></li>	
    	  	  		<li id="ll_contacto"><a href="#mod_contacto" data-rel="dialog" data-transition="pop" >Contacto</a></li>	
    	  	  		<li id="ll_cerrar"><a href="javascript:cerrarSesion();" data-rel="dialog" data-transition="pop" >Cerrar sesi&oacute;n</a></li>		
			  	    </ul>				  	    	    	
			  	  </div>
			  	  <div id=cont_puntos></div>
			  	  <div id=cont_favoritos></div>
			  	  <div id="serv_ptos"></div>
			  	  
				</div><!-- /panel -->
					<div data-role="panel" id="mypanel2" data-theme="a" style="z-index:99999;" data-position="left" data-display="overlay">
    	  		<a href="#mypanel" data-iconpos="top" data-rel="close" data-icon="delete" data-role="button" data-iconpos="notext"></a>
    			  <input type="search" id="qr" name="qr" placeholder="Luis valdes 2557 puente alto / Banco" data-inline="true">
    			  

    			  <input type="button" value="Buscar" onclick="buscar();" data-inline="true">
			  	  <div data-role="collapsible" data-collapsed="false" data-theme='a' id="cola_bus";>
    				  <h3>Direcciones <span id="tot_dir"></span></h3>
							
							<ul data-role="listview"  data-theme="b"  data-filter="true" data-filter-placeholder="Buscar resultado..." data-inset="false" id="list_bus">	
			  	  	 </ul>		  	    	    	
			  	  </div>
			  	  <div data-role="collapsible" data-collapsed="false" data-theme='a' id="cola_bus2";>
    				  <h3>Puntos <span id="tot_pto"></span></h3>
							
							<ul data-role="listview"  data-theme="b"  data-filter="true" data-filter-placeholder="Buscar resultado..." data-inset="false" id="list_bus2">	
			  	  	 </ul>		  	    	    	
			  	  </div>
			  	  
				</div><!-- /panel -->
   		<div data-role="header" >   			 
   			<a href="#mypanel2" data-icon="search" data-role="button" data-iconpos="notext"   class="ui-btn-left">+</a>
      		<h1><img src="img/logo_inicio.png" height=12%>  </h1>       		 		 
      	
      		<a href="#mypanel" data-icon="bars" data-role="button" data-iconpos="notext"  id="bot_conf" class="ui-btn-right">+</a>
   		</div>    		
   	  <div data-role="content" id="contenido_prin" >
   	  	
    	  	<div data-role="popup" id="myPopup">
							<p>This is a completely basic popup, no options set.						</p>
					</div>
					<div data-role="popup" id="myPopup2">
							<p>This is a completely basic popup, no options set.						</p>
					</div>
					
					<div id="contenido_sesion">
						<div class="ui-bar ui-bar-a" style="text-align:right;">
						
						<h3 id="text_supIz" ></h3>
    				<h3 id="text_sup" >...</h3>
					</div>
    	    <div id="map"></div>  
						
						
					</div>          
					
    	</div>
    	<div data-role="footer" data-id="foo1" data-position="fixed" id="footer_txt">
    		<div data-role="navbar">
    			<ul id="list_inf">
    				<li><a href="javascript:ubicacionActual();"><img src="img/current.png" width=32px height=32px></a></li>
    				
    				<li><a href="javascript:checkServ(32,'img/ico_banco.png',1000);"><img src="img/cajero.png" width=32px height=32px></a></li>
    				<li><a href="javascript:loadTS();"><img src="img/bus.png" width=32px height=32px></a></li>
    				<!--li><a href="#mypanel2"><img src="img/search.png" width=32px height=32px></a></li-->
    				<li><a href="javascript:cargarMapa();"><img src="img/add.png" width=32px height=32px></a></li>
    				<li><a href="javascript:limpiarMapa();"><img src="img/clean.png" width=32px height=32px></a></li>
    			</ul>
    	</div>
    	&copy;2014 SolutionWorks
			</div><!-- /footer -->
    	
    	
    	  
 </div>
<div data-role="page" id="mod_sesion" data-theme="a">

   	<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      		<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		
   	  <div data-role="content" id="contenido" >
   	  	
    	  	<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					 Inicio Sesion<div></div>
					</div>
					<div data-role="popup" id="myPopup_reg">
							<p>This is a completely basic popup, no options set.						</p>
					</div>
					<p id="form_login">
						
						
						<input type="text" class=input_form name="mail" id="mail" value="" placeholder="Usuario">
						<input type="password" class=input_form name="clave" id="clave"  autocomplete="off" placeholder="Contrase&ntilde;a">						
						<div id="msg_error_reg" class="msg_error"></div>						
						<input type="button" onclick="loadInicio();" value="Iniciar">
						<p>
							<a href="#mod_recupera" data-rel="dialog" data-transition="pop" ><input type="button" value="Olvido Contrase&ntilde;a?"></a>
						</p>
						
					
						<!--input type="button" onclick="cambiar('mod_registro');" value="Registrarme"-->
					
					</p>          
			
    	    
					
    	</div>
    	  
 		</div> 		
 		
<div data-role="page" id="mod_recupera" data-theme="a">

   	<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      		<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		
   	  <div data-role="content" id="contenido" >
   	  	
    	  	<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					 Recupera Contrase&ntilde;a<div></div>
					</div>
					
					<p id="form_login">
						
						
						<input type="text" class=input_form name="mail_rec" id="mail_rec" value="" placeholder="Usuario">
						<div id="msg_error_rec" class="msg_error"></div>						
						<input type="button" onclick="loadRecupera();" value="Recuperar">
						
					
						<!--input type="button" onclick="cambiar('mod_registro');" value="Registrarme"-->
					
					</p>          
			
    	    
					
    	</div>
    	  
 		</div>  		
<div data-role="page" id="m_mail" data-theme="a">

   	<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      		<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		
   	  <div data-role="content" id="contenido" >
   	  	
    	  	<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					 Comparte!<div></div>
					</div>
					
					<p>
						<input type="text" name="nombre_mail" id="nombre_mail" value="" class=input_form placeholder="Nombre">
						
						<input type="text" name="nombre_dest" id="nombre_dest" value="" class=input_form placeholder="Nombre Destinatario">
						
						
						<input type="text" name="mail_mail" id="mail_mail" value="" class=input_form placeholder="Mail Destinatario">
						
						<textarea class="cla_txttarea" name="mensaje_mail" id="mensaje_mail" cols="10" rows="5" class=input_form placeholder="MEnsaje"></textarea>

						<!--a href="#" data-role="button" data-inline="true" data-theme="b" data-mini="true">Registrarse</a-->
						<div id="msg_mail" class="msg_error"></div>
						<input type="button" onclick="validaMail(CM_id_pto_share);" value="Enviar">
					</p>    
			
    	    
					
    	</div>
    	  
 		</div>  		
 		<div data-role="page" id="mod_registro" data-theme="a">

   	<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      		<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		
			<div data-role="content" data-theme="a" id="cont_registro">
					<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					Registro de Usuario<div></div>
					</div>
					<p>
						
						<input class=input_form type="text" name="nombre" id="nombre" value="" placeholder="Nombre">
						
						
						<input type="text" name="mail_regi" id="mail_regi" value="" class=input_form placeholder="Correo Electronico">

						
						<input type="password" name="clave_regi" id="clave_regi" value="" autocomplete="off" class=input_form placeholder="Clave">
						<label for="textarea"><input type="checkbox" id="envio" name="envio"> Registrarme para env&iacute;o de newsletter</label>
						<!--a href="#" data-role="button" data-inline="true" data-theme="b" data-mini="true">Registrarse</a-->
						<div id="msg_error_registro" class="msg_error"></div>
						<input type="button" onclick="regUser();" value="Registrarse">
					</p>
				</div><!-- /content -->
    	  
 		</div> 	
<div data-role="page" id="mod_contacto" data-theme="a">

   	<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      	<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		
   	  <div data-role="content" id="contenido" >
   	  	
    	  	<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					 Formulario de Contacto<div></div>
					</div>
					
					<p id="form_login">
						
						
						<input type="text" class=input_form name="nom_con" id="nom_con" value="" placeholder="Nombre">
						<input type="text" class=input_form name="mail_con" id="mail_con" value="" placeholder="Mail">
						<input type="text" class=input_form name="tel_con" id="tel_con" value="" placeholder="Telefono">
						<textarea cols="40" rows="13" class=input_form name="descrip_con" id="descrip_con" placeholder="Mensaje"></textarea>
						<div id="msg_error_contacto" class="msg_error"></div>						
						<input type="button" onclick="senContacto();" value="Enviar">
						
					
						<!--input type="button" onclick="cambiar('mod_registro');" value="Registrarme"-->
					
					</p>          
			
    	    
					
    	</div>
    	  
 		</div> 		    

			<div data-role="page" id="m_lugar" data-theme="a">

							<?php
				$categorias=getCategorias();
				$regiones=getRegiones();
				$comuna=getComunaxRegion(13);
				?>
				<div data-role="header" >
	   			 <img id=back_boton src="img/back.png" class="ui-btn-left" onclick="volver();">
      		<h1><img src="img/logo_inicio.png" width=70%>     		 </h1>
      		
   		</div>    		


				<div data-role="content" data-theme="a" id="cont_lugar">
					<div class="ui-bar ui-bar-a" id=barra_sup style="text-align:center;">
					Registra un Punto<div></div>
					</div>
						
					<p>
						
						<input type="text" name="nom_lugar" id="nom_lugar" value="" class=input_form placeholder="Nombre del Lugar">
						
						<!--label for="text-basic">Categoria</label-->
						<select id="cat" name="cat" class="form_drag">
							<?php
							foreach($categorias as $cat)
							{
							?>
							<option value=<?=$cat[0]?>><?=ucwords($cat[1])?></option>
							<?php
							}
							?>
						</select>

						<!--label for="textarea">Regi&oacute;n</label-->
						<select id="reg" name="reg" class="form_drag" onchange="getComuna();">
							<?php
							foreach($regiones as $reg)
							{
								$selected="";
								if(strtolower($reg[0])=='metropolitana')
								{
									$selected="selected";
								}
							?>
							<option value=<?=$reg[1]?> <?=$selected?>><?=ucwords($reg[0])?></option>
							<?php
							}
							?>
						</select>
						<!--label for="textarea">Comuna</label-->
						<select id="ciudad_lugar" class="form_drag" name="ciudad_lugar">
							<?php
							foreach($comuna as $com)
							{
							?>
								<option value="<?=strtolower($com[0])?>"><?=ucwords(strtolower($com[0]))?></option>
							<?php
							}
							?>
						</select>
						
						<input id="calle_lugar" name="calle_lugar" type="text" class=input_form placeholder="Calle">
						
						<input id="num_lugar" name="num_lugar" class=input_form placeholder="N&uacute;mero" type="text" >
						<input class="btn" type="button" value="Validar Direcci&oacute;n" onclick="buscaLugar();">
						<label for="textarea">Seleccione una direcci&oacute;n de la lista</label>						
						<select id="direc_lugar" name="direc_lugar" class="form_drag" onchange="loadMarcadorDrag();">  		
						</select>		
						
						
							
						<input class="form_drag" id="lng" name="lng" type="hidden" >
						
						<input readonly=true class="form_drag" id="lati" name="lati" type="hidden" >
						
						<input class="btn" onclick="saveLugar();" type="button" value="Guardar">
						<div id="msg_error_lugar"></div>
						<div class=msg_drag>Haz clic en validar para corroborar tu direccion en el mapa y luego selecciona una de la lista direcci&oacute;n.</div>
						<div class=msg_drag>Mueve el icono <img src="iconos/lugar.png" width=30px height=30px>para corregir la ubicaci&oacute;n.</div>
						
						
						</br>
						<div id="map2"></div>
					</p>
				</div><!-- /content -->

				
			</div><!-- /page lugar -->  

 			<div id=output></div>
 			<script>
	window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '171716159685522',                        // App ID from the app dashboard
      channelUrl : 'http://www.chilemap.cl', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true,                                 // Look for social plugins on the page
      req_perms : 'publish_stream'
    });

    // Additional initialization code such as adding Event Listeners goes here
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/es_ES/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  
  function loadInit()
  {
  	<?php
  	if(!isset($_REQUEST['pto']) and !isset($_REQUEST['lat']))
					{			
					?>
					  
						//ubicacionActual();
						
					
      	  <?php
      		}
      		if(trim($_REQUEST['q'])!="")
							{
   							?>
   								
   								buscar('<?=$_REQUEST["q"]?>');
   								
   							
   						<?php  
						}
						if(isset($_REQUEST['left']))
 						{
 								?>
 								  
 									zoomExtendido(<?=$_REQUEST['left']?>,<?=$_REQUEST['bottom']?>,<?=$_REQUEST['right']?>,<?=$_REQUEST['top']?>);
 									
 								
 								<?php
 							}
 						if(isset($_REQUEST['lat']) and isset($_REQUEST['lon']))
 				{
 					?>
 			  
 						addMarcadores(<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,"Ubicaci&oacute;n enviada","img/marker.png",35,35);
 						
 				  	moverCentro(<?=$_REQUEST['lat']?>,<?=$_REQUEST['lon']?>,17);
 			  
 					<?php
 				}
 				if(isset($_REQUEST['pto']) and isset($_REQUEST['ptot']))
							{
								if($_REQUEST['ptot']==2)//servicio
								{
									$data_serv=getServicioXId(trim($_REQUEST['pto']));
									//print_r($data_serv);
									$titulo=ucwords(strtolower($data_serv[1]));
								  $direccion="".ucwords($data_serv[5])." #".$data_serv[6]."";
									$texto ="<div id=cont_pop><div class=titulo>".$titulo."</div>";
												
												$texto .="<div class=titulo_pop2>".$direccion."</div>";
												$texto .="<div class=titulo_pop2>".ucwords($data_serv[7])."</div>";			
												$texto .="<div class=botonera><img class=img_boton src=img/favorito.png title=Agregar a favoritos onclick=javascript:addFavorito(".$estado_sesion.",".$data_serv[0].",2);><img class=img_boton src=img/mail.png title=Enviar por correo onclick=compartirPto(".$data_serv[0].",2);><img class=img_boton src=img/facebook.png title=Compartir en Facebook onclick=javascript:compartirFace('".$CM_path_base2."&ptot=2&pto=".$data_serv[0]."');> <a href='https://twitter.com/share?url=".$CM_path_base2."?ptot=2&pto=".$data_serv[0]."&via=chilemap&text=Revisa este link' target=_BLANK><img  class=img_boton src=img/twitter.png title=Compartir en Twitter></a></div></div>";
												
										
							   ?>
							   
							   	  
							   	addMarcadores(<?=$data_serv[4]?>,<?=$data_serv[3]?>,"<?=$texto?>",'img/marker.png',35,35);   		
							   	moverCentro(<?=$data_serv[3]?>,<?=$data_serv[4]?>,17);
							   	
							   <?php  
							 }elseif($_REQUEST['ptot']==3)//servicio
								{
									$data_serv=getServicioPagoXId($_REQUEST['pto']);
									$data_categoria=getServicioCategoria($data_serv[9]);
									//print_r($data_serv);
									$titulo=ucwords(strtolower($data_serv[1]));
								  $direccion="".ucwords($data_serv[5])." #".$data_serv[6]."";
									$texto ="<div id=cont_pop><div clase=titulo>".$titulo."</div>";
												
												$texto .="<div class=titulo_pop2>".$direccion."</div>";
												$texto .="<div class=titulo_pop2>".ucwords($data_serv[7])."</div>";	
												$texto .="<div class=titulo_pop_descrip>".ucwords(trim($data_serv[8]))."</div>";					
												$texto .="<div class=botonera><img class=img_boton src=img/favorito.png title=Agregar a favoritos onclick=javascript:addFavorito(".$estado_sesion.",".$data_serv[0].",1);><img class=img_boton src=img/mail.png title=Enviar por correo onclick=compartirPto(".$data_serv[0].",1);><img class=img_boton src=img/facebook.png title=Compartir en Facebook onclick=javascript:compartirFace('".$CM_path_base2."&ptot=1&pto=".$data_serv[0]."');> <a href='https://twitter.com/share?url=".$CM_path_base2."?ptot=1&pto=".$data_serv[0]."&via=chilemap&text=Revisa este link' target=_BLANK><img  class=img_boton src=img/twitter.png title=Compartir en Twitter></a></div></div>";
												
										
							   ?>
							   
							   	  
							   	addMarcadores(<?=$data_serv[4]?>,<?=$data_serv[3]?>,"<?=$texto?>",'<?=$data_categoria[2]?>',35,35);   		
							   	moverCentro(<?=$data_serv[3]?>,<?=$data_serv[4]?>,14);
							   	
							   <?php  
							 }elseif($_REQUEST['ptot']==1)//direccion
								{
									$data_serv=getDireccionXId($_REQUEST['pto']);
									
								  $direccion="".ucwords($data_serv[5])." #".$data_serv[6]."";
								  $titulo=$direccion;
									//$texto ="<div id=titulo2>".$titulo."</div>";
												
												$texto ="<div id=cont_pop><div class=titulo>".$direccion."</div>";
												$texto .="<div id=titulo_pop2>".ucwords($data_serv[7])."</div>";			
												$texto .="<div id=botonera><img class=img_boton src=img/favorito.png title=Agregar a favoritos onclick=javascript:addFavorito(".$estado_sesion.",".$data_serv[0].",1);><img class=img_boton src=img/mail.png title=Enviar por correo onclick=compartirPto(".$data_serv[0].",1);><img class=img_boton src=img/facebook.png title=Compartir en Facebook onclick=javascript:compartirFace('".$CM_path_base2."&ptot=1&pto=".$data_serv[0]."');> <a href='https://twitter.com/share?url=".$CM_path_base2."?ptot=1&pto=".$data_serv[0]."&via=chilemap&text=Revisa este link' target=_BLANK><img  class=img_boton src=img/twitter.png title=Compartir en Twitter></a></div><div id=cont_pop>";
												
										
							   ?>
							     
							   		addMarcadores(<?=$data_serv[4]?>,<?=$data_serv[3]?>,"<?=$texto?>",'img/marker.png',35,35);   		
							   		moverCentro(<?=$data_serv[3]?>,<?=$data_serv[4]?>,17);
							   	
							   <?php  
							 }
							} 
							?>	
  }
  
	</script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-45595484-1', 'chilemap.cl');
  ga('send', 'pageview');

</script>
    </body>
</html>

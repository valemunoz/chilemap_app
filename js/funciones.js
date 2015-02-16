var path_query="http://www.chilemap.cl/mobile/includes/query_app.php";
var SIS_LON=0;
var SIS_LAT=0;
var bar2="";

var LAT_INI=-33.458943;
var LON_INI=-70.656235;
	
var SIS_ACCU=0;
var SIS_CALLE="";
var SIS_NUM="";
var SIS_COMUNA="";

var SIS_NOM="";
var SIS_CALL="";
var SIS_NM="";
var SIS_COM="";
var SIS_DESC="";
var SIS_CATEG="";

var CM_farma_turno=false;
var ADDPTO=0;
var CM_path="http://www.chilemap.cl";
var CM_path_completo="http://www.chilemap.cl/index_mapa.php";
var CM_id_pto_share="";
var CM_tipo_pto_share="";    
var CM_home="index.html";	
var CM_logo="images/logo.png";
var CM_logo2="images/logo2.png";
var CM_caption='Tu lugar esta aqu&iacute;';
var CM_INTERNET=true;

var FACE_NAME="";
var FACE_MAIL="";
function offline()
{
	CM_INTERNET=false;
	$.mobile.loading( 'hide');
	$("#offline").html("(offline)");
	mensaje("El dispositivo no se encuentra conectado a Internet.","myPopup");
}
function online()
{
	$("#offline").html("");
	if(!CM_INTERNET)
	{
		window.location.href=""+CM_home+"";
	}
	CM_INTERNET=true;
	$.mobile.loading( 'hide');
	//deviceListo();
	
}

function deviceListo()
{
			 				
	$.mobile.loading( 'show', {
			text: 'Cargando...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	
	
	//document.getElementById('qr').value="";
	addServicios('Cajeros',1000,'32','img/ico_banco.png');
	bar2="";
	
	$("#output").load(path_query, 
				{tipo:6} 
					,function(){	
						loadMapa();				
						$.mobile.loading( 'hide');	
						navigator.splashscreen.hide();	


			
					}
			);
			


			loadServiciosPanel();
			
			
}
function fbLoginSuccess(userData) {
    //alert("UserInfo: " + JSON.stringify(userData));
}


function deviceListo2()
{
	$("#output").load(path_query, 
				{tipo:9} 
					,function(){	
										
			
					}
			);
}
function loadInicioSesion()
{
	//$.mobile.changePage('#mod_inicio', { role: 'dialog'});
	$.mobile.changePage('#mod_inicio', { role: 'dialog'});
}
function volver()
{
	
	
	history.go(-1);
}
function loadInicio()
{
	//window.location="home.html";
	var mail=$.trim(document.getElementById("mail").value);
	var clave=$.trim(document.getElementById("clave").value);
	if(mail !="" && clave!="" && validarEmail(mail))
	{
	$.mobile.loading( 'show', {
			text: 'Cargando...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		$("#msg_error_reg").load(path_query, 
			{tipo:7,mail:mail,clave:clave} 
				,function(){	
				
					$.mobile.loading( 'hide');
					
				}
		); 
	}else
		{
			//mensaje("Todos los campos obligatorios","myPopup_reg");
			$("#msg_error_reg").html("Todos los campos obligatorios");
		}
}

function loadMapa()
{
	//init('-70.444','-30.988',15);
	
	init();
	//moverCentro(LAT_INI,LON_INI,12);
	
}
function ubicacionActual()
{
	//AM_exten=getExtencion();
	//alert(AM_exten);
	$.mobile.loading( 'show', {
				text: 'Obteniendo Coordenadas...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			
	navigator.geolocation.getCurrentPosition (function (pos)
		{
			var lat = pos.coords.latitude;
  		var lng = pos.coords.longitude;
  		var accu=pos.coords.accuracy.toFixed(2);
  		
  		SIS_LON=lng;
  		SIS_LAT=lat;
  		SIS_ACCU=accu;
  	  //addMarcadores(lng,lat,'Ubicacion Actual','img/marker.png',30,30);
  	  moverCentro(lat,lng,15);
  	  
  	  //verPuntosDrag();
  	  //activarDrag();

  	  
			
			txt_link=''+CM_path_completo+'?lon='+lng+'&lat='+lat+'';
			if(CM_INTERNET)
			{
				ShortUrl(txt_link);
			}else
				{
					addMarcadores(SIS_LON,SIS_LAT,'<div class=titulo>Ubicaci&oacute;n Actual</div>','img/ico_current.png',40,40);
					$.mobile.loading( 'hide');
				}
			
		
			
			},noLocation,{timeout:6000});
}
function ShortUrl(bigurl)
{
	if(CM_INTERNET)
	{
$.getJSON('https://api-ssl.bitly.com/v3/shorten?',
    {
        format: "json",
        access_token: '87ed0ffc00201e3ac1e540d6e3db09d39c09c424',
        login: 'valeria.m.inostroza',
        longUrl: bigurl
    },
    function(response) {
        link_web=response.data.url;
        $("#output").load(path_query, 
				{tipo:2,lat:SIS_LAT,lon:SIS_LON} 
				,function(){	
					
					addMarcadores(SIS_LON,SIS_LAT,'<div class=titulo>Cerca de</div><div class=titulo_pop2>'+SIS_CALLE+' #'+SIS_NUM+'<br> '+SIS_COMUNA+'</div> <div id=botonera><img class=img_boton src=img/mail.png title=Enviar por correo onclick=compartirPto(0,5);> <img class=img_boton src=img/facebook.png title=Compartir en Facebook onclick=compartirFace("",5);><a href="https://twitter.com/share?url='+link_web+'&via=chilemap&text=Revisa este link" target=_BLANK><img  class=img_boton src=img/twitter.png title=Compartir en Twitter></a></div>','img/ico_current.png',40,40);
					$.mobile.loading( 'hide');
				}
		);
        
    }
);
}
}
function noLocation()
{
	$.mobile.loading( 'hide');
	
	mensaje("Error en la geolocalizaci&oacute;n, por favor intentelo nuevamente","myPopup");
	
}


function mensaje(texto,div)
{
	$( "#"+div ).html("<p>"+ texto+"</p>" );
                  $("#"+div).popup("close");
                  $("#"+div).popup("open");
}
function hideMensaje(div)
{
	  $("#"+div).popup("close");
}



function limpiarMapa()
{
	
	limpiarPuntosDrag();
	deleteTransantiago();
	deleteServicioMapaPagos(100);
	deleteMarcadores();
	$("#list_bus").html("");
			for(i=0;i<CM_servicios.length;i++)
			{
				
				deleteServicioMapa(i);
			}
			
			for(i=0;i<CM_servicios_pago.length;i++)
			{
		
				deleteServicioMapaPagos(i);
			}
			
}


function cerrarSesion()
{
	$("#output").load(path_query, 
				{tipo:8} 
					,function(){	
			
  						window.location.href=""+CM_home+"";
					
			
					}
			);
	
}
function validarEmail( email ) {
	  var valido=true;
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) )
        valido=false;
        
   return valido;     
}

function buscar()
{
	if(CM_INTERNET)
	{
		var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
      
      if(SIS_LON==0 || SIS_LAT==0)
      {
      	lon=CM_centro.lon;
      	lat=CM_centro.lat;
      }else
      	{
      		lon=SIS_LON;
      		lat=SIS_LAT;
      	}
	var qr=$.trim(document.getElementById("qr").value);
	var bus=1;
	$( '#tot_dir' ).html( '' );
	$( '#tot_pto' ).html( '' );
	if(qr!="")
	{
		$.mobile.loading( 'show', {
					text: 'Buscando...',
					textVisible: true,
					theme: 'a',
					html: ""
				});
		$("#list_bus").load(path_query, 
				{tipo:10,query:qr,bus:bus,lon:lon, lat:lat} 
					,function(){	
							
						//$('#cola_bus').trigger('create');
						$('#list_bus').listview('refresh');
			
					}
			);
			$("#list_bus2").load(path_query, 
				{tipo:3,query:qr,lon:lon, lat:lat} 
					,function(){	
						$.mobile.loading( 'hide');	
						//$('#cola_bus').trigger('create');
						$('#list_bus2').listview('refresh');
			
					}
			);
	}else
		{
			mensaje("Debe ingresar una consulta","myPopup");
		}
	}else
		{
			mensaje("El dispositivo no se encuentra conectado a Internet.","myPopup");
		}
		
}

function verMapa(texto,lon,lat,icono)
{
	
	moverCentro(lat,lon,15);
  addMarcadores(lon,lat,texto,icono,30,30);
  $('#mypanel2').panel('close');
}
function loadCategorias()
{
	$("#list_cat").load(path_query, 
				{tipo:11} 
					,function(){	
							
						//$('#cola_bus').trigger('create');
						$('#list_cat').listview('refresh');
						
  	
					
			
					}
			);
}

function loadCategMapa(categ)
{
	
	
	$("#list_bus").load(path_query, 
				{tipo:12, cat:categ} 
					,function(){	
						$('#list_bus').listview('refresh');
						verPuntosDrag();
					}
			);
}

function senContacto()
{
	var mail=$.trim(document.getElementById("mail_con").value);
	var nom=$.trim(document.getElementById("nom_con").value);
	var tel=$.trim(document.getElementById("tel_con").value);
	var descrip=$.trim(document.getElementById("descrip_con").value);
	
	if(mail !="" && nom!="" && validarEmail(mail) && descrip!="")
	{
		$("#output").load(path_query, 
				{tipo:13, mail:mail,nom:nom,tel:tel,descrip:descrip} 
					,function(){
						$("#mod_contacto").dialog("close");	
						setTimeout('mensaje("Mensaje Enviado.","myPopup");',500);
						
						
					}
			);
		
	}else
		{
			$("#msg_error_contacto").html("Nombres, mail y descripci&oacute;n son campos obligatorios.");
		}
}
function regUser()
{
	
	var nombre=document.getElementById("nombre").value;
	var clave=$.trim(document.getElementById("clave_regi").value);
	var mail=document.getElementById("mail_regi").value;
	var newsletter=document.getElementById("envio").checked;
	var msg="";
	var valida=true;
	
	if($.trim(nombre)=="" || $.trim(clave)=="" || $.trim(mail)=="")
	{		
		valida=false;
		msg="<strong>Todos los campos son obligatorios.</strong><br>";
	}
	if(!validarEmail(mail))
	{		
		msg=""+msg+" <strong>E-mail debe tener formato correcto.</strong><br>";
		valida=false;
	}
	if(clave.length != 6)
	{		
		msg=""+msg+" <strong>La clave debe contener 6 caracteres.</strong><br>";
		valida=false;
	}
	
	if(!valida)
	{
		var capaContenedora = document.getElementById("msg_error_registro");
		capaContenedora.innerHTML=msg;
		
	}else
	{
		
		$("#msg_error_registro").load(path_query, 
			{tipo:14, nombre:""+nombre+"", clave:""+clave+"", mail:""+mail+"", tipo_usuario:1,news:newsletter, pais:"Chile"} 
				,function(){	
				}
		);
	}
}
function msgActivacion()
{
	var mail=document.getElementById("mail").value;
$("#output").load("confirmacion.php", 
			{tipo:1, mail:mail} 
				,function(){	
				}
		);
}
function loadServiciosPanel()
{
	
$("#serv_ptos").load(path_query, 
			{tipo:15} 
				,function(){	
					$('#serv_ptos').trigger('create');
				}
		);
}
function loadFavoritos()
{
	
$("#cont_favoritos").load(path_query, 
			{tipo:17} 
				,function(){	
					$('#cont_favoritos').trigger('create');
				}
		);
}
function addFavorito(cm_estadoSesion,CM_id_data,CM_tipo_data)
{
	
	if(cm_estadoSesion==0)
	{
		hideMensaje("myPopup_static");
		$("#output").load(path_query, 
			{tipo:19, id:CM_id_data, tipo_data:CM_tipo_data} 
				,function(){	
					loadFavoritos();
					setTimeout('mensaje("Punto ya agregado a favoritos","myPopup");',500);
				}
		);
	}else
	{
		//launchWindow('#mod_sesion');
		//$.mobile.changePage('#m_sesion', 'pop', true, true);
		$.mobile.changePage('#mod_sesion', { role: 'dialog'});
	}
	
}
function deleteFavoritos(CM_id)
{
	$.mobile.loading( 'hide');
	$("#output").load(path_query, 
			{tipo:18, id_fav:CM_id} 
				,function(){	
					loadFavoritos();					
					setTimeout('mensaje("Eliminado de Favoritos.","myPopup");',500);
					
				}
		);
}

function deleteMiPunto(CM_id)
{
	$.mobile.loading( 'hide');
	$("#output").load(path_query, 
			{tipo:28, id_fav:CM_id} 
				,function(){	
					loadPuntos();					
					setTimeout('mensaje("Punto Eliminado.","myPopup");',500);
					
				}
		);
}
function compartirPto(CM_id,CM_tipo)
{
	CM_id_pto_share=CM_id;
	CM_tipo_pto_share=CM_tipo;    
	
	//$.mobile.changePage('#m_mail', 'pop', true, true);
	$.mobile.changePage('#m_mail', { role: 'dialog'});
}

function validaMail(CM_cadena)
{	
	CM_cadena=CM_id_pto_share;
	var nombre=document.getElementById("nombre_mail").value;
	var nombre_d=document.getElementById("nombre_dest").value;
	
	var mail=document.getElementById("mail_mail").value;
	var mensaje=document.getElementById("mensaje_mail").value;
	var CM_link;
	if(CM_cadena=="" && CM_cadena==0)
	{
		AM_exten=getExtencion();
		CM_link=CM_path_completo+"?left="+AM_exten.left+"&bottom="+AM_exten.bottom+"&right="+AM_exten.right+"&top="+AM_exten.top;
	}
	if(CM_cadena>0)
	{
		CM_link=CM_path_completo+"?ptot="+CM_tipo_pto_share+"&pto="+CM_id_pto_share;
		CM_id_pto_share=0;
		CM_tipo_pto_share=0;
		
	}
	if(CM_tipo_pto_share==5)
	{
		CM_link=CM_path_completo+"?lon="+SIS_LON+"&lat="+SIS_LAT;
		CM_id_pto_share=0;
		CM_tipo_pto_share=0;
	}
	//alert(CM_link);
	var msg="";
	var valida=true;
	if($.trim(nombre_d)=="" || $.trim(nombre)=="" || $.trim(mail)=="")
	{		
		valida=false;
		msg="<strong>Todos los campos son obligatorios.</strong><br>";
	}
	if(!validarEmail(mail))
	{		
		msg=""+msg+" <strong>E-mail debe tener formato correcto.</strong><br>";
		valida=false;
	}
	
	if(!valida)
	{
		
		
		$("#msg_mail").html(msg);
		
	}else
	{
		
		
		$("#msg_mail").load(path_query, 
			{tipo:20, nombre:nombre, nombre_d:nombre_d, mail:mail, msg:mensaje,link:CM_link} 
				,function(){	
					$("#m_mail").dialog("close");	
					
				}
		);
		
	}
}
function compartirFace(CM_link,tipo)
{
	
	CM_link=CM_path_completo+"?ptot="+tipo+"&pto="+CM_link+"";
	if(CM_link=="")
	{
		CM_link=CM_path;
	}
	if(tipo==5)
	{
		CM_link=CM_path_completo+"?lon="+SIS_LON+"&lat="+SIS_LAT;
	}
	
  	getLoginStatus(CM_link);
  	
   
  /* facebookConnectPlugin.showDialog({
    method: "feed",
    link: ''+CM_link+'',
     picture: ""+CM_path+"/"+CM_logo2+"",
      caption: CM_caption,
      description: 'Revisa este link!'  
}, successFace, failureFace);*/
}
function getLoginStatus(CM_link) {
	
                facebookConnectPlugin.getLoginStatus(function(response) {
                	//alert("Result: " + JSON.stringify(response));
                                  if (response.status == 'connected') {
                                  	
                                  		
//                                  alert(response.authResponse.userID);
                                  facebookConnectPlugin.api(response.authResponse.userID+"/?fields=id,name", [],
    function (result) {
    	FACE_NAME=result.name;
        //alert("Result: " + JSON.stringify(result));
        /* alerts:
            {
                "id": "000000123456789",
                "email": "myemail@example.com"
            }
        */
    },
    function (error) {
        alert("Failed: " + error);
    });
                                  
                                  facebookConnectPlugin.showDialog({
																	    method: "feed",
																	    link: ''+CM_link+'',
																	     picture: ""+CM_path+"/"+CM_logo2+"",
																	      caption: CM_caption,
																	      description: FACE_NAME+' compartio este link!'  
																	}, successFace, failureFace);
                                  
                                  } else {
                                  //alert('not logged in');
                                  facebookConnectPlugin.login(["public_profile"],
    																function (){
    																	facebookConnectPlugin.api(response.authResponse.userID+"/?fields=id,name", [],
    function (result) {
    	FACE_NAME=result.name;
        //alert("Result: " + JSON.stringify(result));
        /* alerts:
            {
                "id": "000000123456789",
                "email": "myemail@example.com"
            }
        */
    },
    function (error) {
        alert("Failed: " + error);
    });
    																	
    																	facebookConnectPlugin.showDialog({
																	    method: "feed",
																	    link: ''+CM_link+'',
																	     picture: ""+CM_path+"/"+CM_logo2+"",
																	      caption: CM_caption,
																	      description: FACE_NAME+' compartio este link!'  
																	}, successFace, failureFace);},
    																function (error) { /*alert("" + error)*/ }
																	);
                                  
                                  }
                                  });
 }

function successFace()
{
	//alert("paso");

}
function failureFace()
{
	//alert("NO paso");
	
}
function loadRecupera()
{
			
	var mail=document.getElementById("mail_rec").value;
		$("#msg_error_rec").html("");
	if(!validarEmail(mail))
	{
		$("#msg_error_rec").html("El formato del mail es incorrecto");
	}else
		{
			$("#msg_error_rec").load(path_query, 
			{tipo:21, mail:mail} 
				,function(){	
					//$("#mod_sesion").dialog("close");
					//$("#mod_recupera").dialog("close");	
					
					
					
				}
		);		
		}
}

function addDescripCajero(tipo,valor,id_serv)
{
	
	$("#output").load(path_query, 
			{tipo:22, tipo_data:tipo, valor:valor,serv:id_serv} 
				,function(){						
					//hideMensaje("myPopup")
					$("#mini_resp").html("Gracias por la informaci&oacute;n");
				}
		);		
}

function cargarMapa()
{
	$("#output").load(path_query, 
			{tipo:23} 
				,function(){						
					
				}
		);	
	
	
	
	
}
function cargaMapa2()
{
	try{
		map2.destroy();
	}catch(e){} 
	init2("map2");
	var CM_centro= map.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	addMarcadorVector(CM_centro.lon,CM_centro.lat,"","iconos/lugar.png",35,35);
	moverCentro2(CM_centro.lon,CM_centro.lat,15);
	activarDrag();
  document.getElementById("lng").value=CM_centro.lon;
  document.getElementById("lati").value=CM_centro.lat;
}
function getComuna()
{
	
	var region=document.getElementById("reg").value;
	$("#ciudad_lugar2").load(path_query, 
			{tipo:24, region:region} 
				,function(){	
					$('#ciudad_lugar2').trigger('create');
				}
		);
}

function buscaLugar()
{
	
	document.getElementById("direc_lugar").value="";
	$.mobile.loading( 'show', {
			text: 'Buscando...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
	var calle=document.getElementById("calle_lugar").value;
	var numero=document.getElementById("num_lugar").value;
	var comuna=document.getElementById("ciudad_lugar").value;
	if($.trim(calle)!="" && $.trim(numero)!="" && $.trim(comuna)!="")
	{
		$("#direc_lugar").html("");
		$("#direc_lugar").load(path_query, 
			{tipo:25, calle:calle, numero:numero,comuna:comuna} 
				,function(){	
					
					$.mobile.loading( "hide" );
					
					
				}
		);
	}else
		{
			$.mobile.loading( "hide" );
			msg="Los campos Ciudad, Calle y Numero son obligatorios";
			$("#msg_error_lugar").html(msg);
		}
}
function saveLugar()
{
	var valida=true;
	var msg="";
	var lugar=document.getElementById("nom_lugar").value;
	var categoria=document.getElementById("cat").value;
	var region=document.getElementById("reg").value;
	
	var calle=document.getElementById("calle_lugar").value;
	var numero=document.getElementById("num_lugar").value;
	var comuna=document.getElementById("ciudad_lugar").value;
	
	
	
	var lon=document.getElementById("lng").value;
	var lat=document.getElementById("lati").value;
	if($.trim(lugar)=="" || $.trim(categoria)=="" || $.trim(region)=="" || $.trim(calle)=="" || $.trim(numero)=="" || $.trim(comuna)=="" || $.trim(lon)=="" || $.trim(lat)=="")
	{
		valida=false;
		msg +="<br>Todos los campos son obligatorios";
	}
	if(valida)
	{
	$("#msg_error_lugar").load(path_query, 
			{tipo:26, calle:calle, numero:numero,comuna:comuna,lugar:lugar,categoria:categoria,region:region,lon:lon,lat:lat} 
				,function(){	
					loadPuntos();
					
				}
		);
	}else
		{
			$("#msg_error_lugar").html(msg);
		}
}

function loadMarcadorDrag()
{
	var coord=document.getElementById("direc_lugar").value;	
	CM_lonlat=coord.split(",");
	  document.getElementById("lng").value=CM_lonlat[0];
  document.getElementById("lati").value=CM_lonlat[1];
	addMarcadorVector(CM_lonlat[0],CM_lonlat[1],"","iconos/lugar.png",40,40);
  moverCentro2(CM_lonlat[0],CM_lonlat[1],15);
  //activarDrag();
}
function loadPuntos()
{
	
$("#cont_puntos").load(path_query, 
			{tipo:27} 
				,function(){	
					$('#cont_puntos').trigger('create');
				}
		);
}

function loadCatLugar()
{
	$("#contenido_lugar").load(path_query, 
			{tipo:29} 
				,function(){	
					$('#contenido_lugar').trigger('create');
					
					
				}
		);
}
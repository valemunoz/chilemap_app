var map,selectControl,selectControl_ondemand,styleMapDis;
var CM_servicios=Array();
var CM_servicios_estado=Array();
var CM_servicios_icono=Array();

var CM_servicios_pago=Array();
var CM_servicios_pago_estado=Array();
var CM_servicios_pago_icono=Array();


//var ptos_vector_ondemand=[];
var ptos_vector_ondemand2;
var ptos_vector_ondemand=Array();
var ptos_vector_ondemandPagos=Array();
var sprintersLayer;
var ptos_transantiago=[];
var ptos_vector=[];
var CM_transantiago=false;
var MIN_ZOOM_TRANS=15;
var MIN_ZOOM_PAGO=15;
var MIN_ZOOM_ANTENAS=14;
var CM_vector_current;

var CM_id_antena=77;


var CM_MSG_TRANSZOOM='<div id=cont_pop>Para desplegar paraderos necesitas un zoom minimo de _MIN_TRANS y tu zoom actual es: _ZOOM_ .<br><a href="javascript:map.zoomTo('+MIN_ZOOM_TRANS+');">Ir al zoom necesario</a></div>';

function init() {
	
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: new OpenLayers.Projection("EPSG:900913"),
        numZoomLevels: 21,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ]
    });
    map.setCenter(new OpenLayers.LonLat(-70.656235,-33.458943).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), 10);
    map.events.register("moveend", null, loadMovimiento);  
      
      /*Marcadores*/
      styleMapDis= new OpenLayers.StyleMap({
            externalGraphic: "img/servicio.png",
            graphicOpacity: 1.0,
            graphicWidth: 26,
            graphicHeight: 26,
            graphicYOffset: -32
        });
     
     sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {styleMap:styleMapDis});
     
   
    selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
        
   map.addLayer(sprintersLayer);
   map.addControl(selectControl);
   
   
   /*Geolocaliczacion*/
   
		var style_current = {
    	fillColor: '#000',
    	fillOpacity: 0.1,
    	strokeWidth: 0
		};
		CM_vector_current = new OpenLayers.Layer.Vector("vector_current", {styleMap: style_current});
		map.addLayer(CM_vector_current);

		var pulsate = function(feature) 
		{
    	var point = feature.geometry.getCentroid(),
    	    bounds = feature.geometry.getBounds(),
    	    radius = Math.abs((bounds.right - bounds.left)/2),
    	    count = 0,
    	    grow = 'up';
    	
    	var resize = function(){
    		if (count>16) {
    		        clearInterval(window.resizeInterval);
    		}
    		var interval = radius * 0.03;
    		var ratio = interval/radius;
    		switch(count) {
    		  case 4:
    		  case 12:
    		  grow = 'down'; break;
    		  case 8:
    		  grow = 'up'; break;
    		}
    		if (grow!=='up') {
    			ratio = - Math.abs(ratio);
    		}
    		feature.geometry.resize(1+ratio, point);
    		CM_vector_current.drawFeature(feature);
    		count++;
    	};
    	window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};

		geolocate = new OpenLayers.Control.Geolocate({
    	bind: false,
    	geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    	}
		});
		map.addControl(geolocate);

		var firstGeolocation = true;
		geolocate.events.register("locationupdated",geolocate,function(e) 
		{
			
    	CM_vector_current.removeAllFeatures();
    	//alert(e.point.x);
    	var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
            e.position.coords.accuracy/2,
            40,
            0
        ),
        {},
        style_current
    	);
    	CM_vector_current.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    	]);
    	if (firstGeolocation) {
    		
        map.zoomToExtent(CM_vector_current.getDataExtent());
        pulsate(circle);
        firstGeolocation = false;
        this.bind = false;
    	}
    	
		});
		geolocate.events.register("locationfailed",this,function() 
		{
    	OpenLayers.Console.log('Location detection failed');
		});


		/*Fin  geolocalizacion*/
}
function addMarcadores(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{

var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -32
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_vector.push(ptos_vector_);
  sprintersLayer.addFeatures(ptos_vector_);
  
}
function addMarcadoresOndemand(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height,CM_id)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -32
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	//ptos_vector_ondemand[CM_id] = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_vector_ondemand2= new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	//ptos_vector_ondemand.push(ptos_vector_ondemand2);
	//ptos_vector_ondemand2.fid = ""+CM_id+"";
  //sprintersLayer.addFeatures(ptos_vector_ondemand[CM_id]);
  ptos_vector_ondemand[CM_id].push(ptos_vector_ondemand2);
  sprintersLayer.addFeatures(ptos_vector_ondemand2);
  
}

function addMarcadoresOndemandPagos(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height,CM_id)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -32
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	//ptos_vector_ondemand[CM_id] = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_vector_ondemand2= new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	//ptos_vector_ondemand.push(ptos_vector_ondemand2);
	//ptos_vector_ondemand2.fid = ""+CM_id+"";
  //sprintersLayer.addFeatures(ptos_vector_ondemand[CM_id]);
  ptos_vector_ondemandPagos[CM_id].push(ptos_vector_ondemand2);
  sprintersLayer.addFeatures(ptos_vector_ondemand2);
  
}
function addMarcadoresOtros(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{
	
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -32
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	var ptos_transantiago_ = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	ptos_transantiago.push(ptos_transantiago_);
  sprintersLayer.addFeatures(ptos_transantiago_);
  
}
function onSelectFeatureFunction(feature)
{
	
	var datas;
		 for (var key in feature.attributes) {
                        
                        if(feature.attributes[key]!="undefined")
                        {
                        	datas =feature.attributes[key];
                        }
                        
                     
                    }
                    $( "#cont_static" ).html("<p>"+ datas+"</p>" );
                  $("#myPopup_static").popup("close");
                  $("#myPopup_static").popup("open");
            	      
            	
        
}

function verMarcadores()
{
	map.zoomToExtent(sprintersLayer.getDataExtent(),false);
}
function moverCentro(CM_lat,CM_lon,CM_zoom)
{
	map.setCenter(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), CM_zoom);

}
function checkServ(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	
	if(getEstadoServicio(CM_id)==0)
	{
		desactivarServicio(CM_id);
		deleteServicioMapa(CM_id);
	}else
	{
		if(getEstadoServicio(CM_id)==1)
		{
			if(CM_id_servicio_gis== CM_id_antena)
			{
				if(map.getZoom()  >= MIN_ZOOM_ANTENAS)
				{
					activarServicio(CM_id);
					loadServEsp(CM_id_servicio_gis,CM_icono,CM_id);
				}else
					{
						mensaje("El servicio de antenas solo esta disponible desde un zoom "+MIN_ZOOM_ANTENAS+". Si desea acercarse a ese zoom haga click <a href=javascript:map.zoomTo("+MIN_ZOOM_ANTENAS+");>aqui</a>");
					}
			}else
			{
				activarServicio(CM_id);
				loadServEsp(CM_id_servicio_gis,CM_icono,CM_id);
			}
		}
	}
	
}

function checkServPago(CM_id_servicio_gis,CM_icono,CM_id)//AKA
{
		

	
	if(getEstadoServicioPagos(CM_id)==0)
	{
		desactivarServicioPagos(CM_id);
		deleteServicioMapaPagos(CM_id);
	}else
	{
		if(getEstadoServicioPagos(CM_id)==1)
		{
			activarServicioPagos(CM_id);
			$.mobile.loading( 'show', {
					text: 'Cargando...',
					textVisible: true,
					theme: 'a',
					html: ""
				});
			loadServEspPagos(CM_id_servicio_gis,CM_icono,CM_id);
		}
	}
	
}
function loadServEsp(CM_id_servicio_gis,CM_icono,CM_id)
{
	$.mobile.loading( 'show', {
					text: 'Cargando...',
					textVisible: true,
					theme: 'a',
					html: ""
				});
	activarServicio(CM_id);
	//deleteServicioMapa(CM_id);
		
	var AM_exten = getExtencion();
	
	/*var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src","includes/query.php?tipo=4&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);*/
	$("#output").load(path_query, 
				{tipo:4,loni:AM_exten.left,lati:AM_exten.bottom,lond:AM_exten.right,lats:AM_exten.top,id:CM_id_servicio_gis,icono:CM_icono,id_serv:CM_id} 
					,function(){	
						$.mobile.loading( 'hide');	
										
			
					}
			);
	
}

function loadServEspPagos(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	activarServicioPagos(CM_id);
	//deleteServicioMapa(CM_id);
		
	var AM_exten = getExtencion();
	
	/*var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src",""+path_query+"?tipo=16&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);*/
	$("#output").load(path_query, 
				{tipo:16,loni:AM_exten.left,lati:AM_exten.bottom,lond:AM_exten.right,lats:AM_exten.top,id:CM_id_servicio_gis,icono:CM_icono,id_serv:CM_id} 
					,function(){	
						$.mobile.loading( 'hide');	
										
			
					}
			);
	
	
	
}
function addServicios(CM_nombre,CM_id,CM_id_serv,CM_icono)
{
	 CM_servicios[CM_id]=CM_id_serv; //id original servicios BD
	 CM_servicios_estado[CM_id]=1; //inactivo
	 CM_servicios_icono[CM_id]=CM_icono; //inactivo
	 ptos_vector_ondemand[CM_id]=[];
	 
	 
	 /*markers_ondemand[CM_id] = new OpenLayers.Layer.Vector( ""+CM_nombre+"" , {styleMap:styleMapDis});
     
   
    selectControl_ondemand = new OpenLayers.Control.SelectFeature(markers_ondemand[CM_id], {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
        
   map.addLayer(markers_ondemand[CM_id]);
   map.addControl(selectControl_ondemand);*/
  
}

function addServiciosPagos(CM_nombre,CM_id,CM_id_serv,CM_icono)
{
	 CM_servicios_pago[CM_id]=CM_id_serv; //id original servicios BD
	 CM_servicios_pago_estado[CM_id]=1; //inactivo
	 CM_servicios_pago_icono[CM_id]=CM_icono; //inactivo
	 ptos_vector_ondemandPagos[CM_id]=[];
	 
	 
	 /*markers_ondemand[CM_id] = new OpenLayers.Layer.Vector( ""+CM_nombre+"" , {styleMap:styleMapDis});
     
   
    selectControl_ondemand = new OpenLayers.Control.SelectFeature(markers_ondemand[CM_id], {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
        
   map.addLayer(markers_ondemand[CM_id]);
   map.addControl(selectControl_ondemand);*/
  
}

function activarServicio(CM_id)
{
	 CM_servicios_estado[CM_id]=0;
}
function desactivarServicio(CM_id)
{
	
	 CM_servicios_estado[CM_id]=1;
}
function getEstadoServicio(CM_id)
{
	 return CM_servicios_estado[CM_id];
}


function activarServicioPagos(CM_id)
{
	 CM_servicios_pago_estado[CM_id]=0;
}
function desactivarServicioPagos(CM_id)
{
	
	 CM_servicios_pago_estado[CM_id]=1;
}
function getEstadoServicioPagos(CM_id)
{
	 return CM_servicios_pago_estado[CM_id];
}

function getExtencion()
{
	var AM_exten=map.getExtent().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
   /*   alert("LonI"+AM_exten.left);
			alert("LatI"+AM_exten.bottom);
	
			alert("lonD"+AM_exten.right);
	alert("lats"+AM_exten.top);*/
	return AM_exten;
}

function loadMovimiento()
{
	
			for(i=0;i<CM_servicios_pago.length;i++)
			{
		
				if(CM_servicios_pago_estado[i]==0)
				{
					deleteServicioMapaPagos(i);
					$.mobile.loading( 'show', {
					text: 'Cargando...',
					textVisible: true,
					theme: 'a',
					html: ""
				});
			
					loadServEspPagos(CM_servicios_pago[i],CM_servicios_pago_icono[i],i);
				}
			}
			for(i=0;i<CM_servicios.length;i++)
			{
				
		
				if(CM_servicios_estado[i]==0)
				{
					if(CM_servicios[i]== CM_id_antena)
					{
						if(map.getZoom()  >= MIN_ZOOM_ANTENAS)
						{
							deleteServicioMapa(i);
							loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
						}else
							{
								deleteServicioMapa(i);
								mensaje("<p>El servicio de antenas solo esta disponible desde un zoom "+MIN_ZOOM_ANTENAS+". Si desea acercarse a ese zoom haga click <a href=javascript:map.zoomTo("+MIN_ZOOM_ANTENAS+");>aqui</a></p>");
							}
					}else
					{
						
						deleteServicioMapa(i);
						loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
					}
				}
			}
			
			if(CM_farma_turno==true)
			{
				deleteServicioMapa(0);
				loadFarma();
			}
	if(CM_transantiago==true)
	{
		if(map.getZoom() >= MIN_ZOOM_TRANS)
		{
			deleteTransantiago();
			loadTransantiagoPar();
		}else
		{
			deleteTransantiago();
			var msg=replaceAll(CM_MSG_TRANSZOOM,'_ZOOM_',''+map.getZoom()+'');
			var msg=replaceAll(msg,'_MIN_TRANS',''+MIN_ZOOM_TRANS+'');
			mensaje(msg);
		}
	}
	
	//load servicips pagos full
	deleteServicioMapaPagos(100);
	if(map.getZoom() >= MIN_ZOOM_PAGO)
	{
		var AM_exten = getExtencion();
		$("#output").load(path_query, 
			{tipo:12, loni:AM_exten.left, lati:AM_exten.bottom, lond:AM_exten.right, lats:AM_exten.top} 
				,function(){	
				}
		);
	}
	
	
	

}

function loadTS()
{
	
	if(CM_transantiago==true)
	{
				
		CM_transantiago=false;
		deleteTransantiago();
		
		
	}else
	{
		if(map.getZoom() >= MIN_ZOOM_TRANS)
		{
			CM_transantiago=true;
			loadTransantiagoPar();
		}else
		{
			
			var msg=replaceAll(CM_MSG_TRANSZOOM,'_ZOOM_',''+map.getZoom()+'');
			var msg=replaceAll(msg,'_MIN_TRANS',''+MIN_ZOOM_TRANS+'');
			
			 mensaje(msg,"myPopup");
		}
	}
}
function loadTransantiagoPar()
{
		$.mobile.loading( "hide" );
							$.mobile.loading( 'show', {
			text: 'Buscando Paraderos...esto puede tardar algunos segundos.',
			textVisible: true,
			theme: 'b',
			html: ""
		});
	var AM_exten = getExtencion();
	
		$("#list_bus2").load(path_query, 
			{tipo:5, loni:AM_exten.left, lati:AM_exten.bottom, lond:AM_exten.right, lats:AM_exten.top} 
				,function(){	
					$('#list_bus2').listview('refresh');
					$.mobile.loading( "hide" );
				}
		);
}
/*Eliminar limpiar*/
function deleteServicioMapa(CM_id)
{	
	
	try{
	
   
		sprintersLayer.removeFeatures(ptos_vector_ondemand[CM_id]);	
		ptos_vector_ondemand[CM_id]=[];			
			/*for(i=0;i<CM_servicios.length;i++)
			{
		
				if(CM_servicios_estado[i]==0)
				{
					//deleteServicioMapa(i);
					loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
				}
			}*/
		  
}catch(e){}
}

function deleteServicioMapaPagos(CM_id)
{	
	
	try{
	
   
		sprintersLayer.removeFeatures(ptos_vector_ondemandPagos[CM_id]);	
		ptos_vector_ondemandPagos[CM_id]=[];			

		  
}catch(e){}
}


function deleteTransantiago()
{	
	
	try{
	sprintersLayer.removeFeatures(ptos_transantiago);		
	ptos_transantiago=[];
	//sprintersLayer.removeFeatures(sprintersLayer.features[2]);		
		//sprintersLayer.redraw();
		  
	}catch(e){}
		
}


function deleteMarcadores()
{
	//try
	//{
			//sprintersLayer.destroyFeatures(ptos_vector.features);		
			sprintersLayer.removeFeatures(ptos_vector);	
			ptos_vector=[];
			
	//}catch(e){}   
}
/**/
function replaceAll( text, busca, reemplaza ){
	try
	{

  while (text.toString().indexOf(busca) != -1)

      text = text.toString().replace(busca,reemplaza);

  return text;
}catch(e){}

}

function currentLocation()
{
	 CM_vector_current.removeAllFeatures();
    geolocate.deactivate();
    var style_current = {
    	fillColor: '#000',
    	fillOpacity: 0.1,
    	strokeWidth: 0
		};
		CM_vector_current = new OpenLayers.Layer.Vector("vector_current", {styleMap: style_current});
		map.addLayer(CM_vector_current);

		var pulsate = function(feature) 
		{
    	var point = feature.geometry.getCentroid(),
    	    bounds = feature.geometry.getBounds(),
    	    radius = Math.abs((bounds.right - bounds.left)/2),
    	    count = 0,
    	    grow = 'up';
    	
    	var resize = function(){
    		if (count>16) {
    		        clearInterval(window.resizeInterval);
    		}
    		var interval = radius * 0.03;
    		var ratio = interval/radius;
    		switch(count) {
    		  case 4:
    		  case 12:
    		  grow = 'down'; break;
    		  case 8:
    		  grow = 'up'; break;
    		}
    		if (grow!=='up') {
    			ratio = - Math.abs(ratio);
    		}
    		feature.geometry.resize(1+ratio, point);
    		CM_vector_current.drawFeature(feature);
    		count++;
    	};
    	window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};

		geolocate = new OpenLayers.Control.Geolocate({
    	bind: false,
    	geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    	}
		});
		map.addControl(geolocate);

		var firstGeolocation = true;
		geolocate.events.register("locationupdated",geolocate,function(e) 
		{
			
    	CM_vector_current.removeAllFeatures();
    	//alert(e.point.x);
    	var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
            e.position.coords.accuracy/2,
            40,
            0
        ),
        {},
        style_current
    	);
    	CM_vector_current.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    	]);
    	if (firstGeolocation) {
    		
        map.zoomToExtent(CM_vector_current.getDataExtent());
        pulsate(circle);
        firstGeolocation = false;
        this.bind = false;
    	}
    	
		});
		geolocate.events.register("locationfailed",this,function() 
		{
    	OpenLayers.Console.log('Location detection failed');
		});

        //geolocate.watch = true;
       // firstGeolocation = true;
        geolocate.activate();
  
}

var CM_div_mapa,layer2,map2,selectControl2;
var drag2,sprintersLayer2;
var ptos_vector2=[];
function init2(CM_div)
{
	
	  CM_div_mapa=CM_div;
	   map2 = new OpenLayers.Map({
        div: ""+CM_div_mapa+"",
        theme: null,
        projection: new OpenLayers.Projection("EPSG:900913"),
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ]
    });
    
   styleMapDis2= new OpenLayers.StyleMap({
            externalGraphic: "img/servicio.png",
            graphicOpacity: 1.0,
            graphicWidth: 26,
            graphicHeight: 26,
            graphicYOffset: -32
    });
     
    sprintersLayer2 = new OpenLayers.Layer.Vector("Sprinters", {styleMap:styleMapDis2});
     
    map2.addLayer(sprintersLayer2);
     
   	selectControl2 = new OpenLayers.Control.SelectFeature(
	  		sprintersLayer2,
				{ highlightOnly:true, toggle: true, onSelect: selectPunto, onUnselect: unselectLinea }
		);
    map2.addControl(selectControl2);
    selectControl2.activate();
   
    drag2=new OpenLayers.Control.DragFeature(sprintersLayer2,{    
     'onComplete':moveDrag});
    map2.addControl(drag2);
  
   map2.setCenter(new OpenLayers.LonLat(-74.086711,4.590130).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), 10);
}
function selectPunto(feature)
{
	//alert("paso");
var datas;
		 for (var key in feature.attributes) {
                        
                        if(feature.attributes[key]!="undefined")
                        {
                        	datas =feature.attributes[key];
                        	alert(datas);
                        }
                        
                     
                    }
	
}
function activarDrag()
{
	drag2.activate();
}

function desactivarDrag()
{
	drag2.desactivate();
}
function verPuntosDrag()
{
	map2.zoomToExtent(sprintersLayer2.getDataExtent(),false);
}
function limpiarPuntosDrag()
{
	try
  {
  	sprintersLayer2.removeFeatures(ptos_vector2);	
			ptos_vector2=[];
  		
		
  }catch(e){}   
}
function moverCentro2(CM_lon,CM_lat,CM_zoom)
{
	map2.setCenter(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), CM_zoom);
}
function addMarcadorVector(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{
	 
	selectControl2.activate();
	sprintersLayer2.setZIndex(6000);
var CM_style2 ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -32
		};        
	var points_vector2 = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	if(CM_texto!="")
	{
		var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector2,{'data':CM_texto},CM_style2);
	}else
		{
			var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector2,{},CM_style2);
		}
	
	
	ptos_vector2.push(ptos_vector_);
  sprintersLayer2.addFeatures(ptos_vector_);
  
  
   /*for(fid in sprintersLayer.features) {
                   feature = sprintersLayer.features[fid];
                   alert(feature['geometry']);
                   for (var key in feature) 
                   {
                   	alert(key);
                  }
               }*/
}
function unselectLinea()
{
	//alert("desselecciono");
}
function moveDrag(feature, pixel)
{
	
    		lon=feature.geometry['x'];
    		lat=feature.geometry['y'];
    		lonlat=new OpenLayers.LonLat(lon,lat).transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  			);
    		
         document.getElementById("lng").value=lonlat.lon;
         document.getElementById("lati").value=lonlat.lat;
  
}

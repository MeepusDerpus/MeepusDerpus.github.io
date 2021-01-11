var DayScene = true;
var ToggleRotation = false;   //rotate camera
var RotationClockwise = true;
var Theta = 0;
var RotationSpeeds = 0.1;
var ZoomLevel = 1.0;
document.getElementById("menu").style.display = "none";

var orbit;
var camera;
var scene;
var renderer;
var controls;
var stats = new Stats();


//Global Lights
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.name = "Sun";

var pointLight1 = new THREE.PointLight(0xff5808);
var pointLight2 = new THREE.PointLight(0x00f2ff);
var pointLight3 = new THREE.PointLight(0xfcba03);


pointLight1.name = "point1";
pointLight2.name = "point2";
pointLight3.name = "point3";

pointLight1.decay = 1;
pointLight2.decay = 1;
pointLight3.decay = 1;


function onResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function Menu()
{
    window.addEventListener("contextmenu",function(event)
    {
        event.preventDefault();

        var contextElement = document.getElementById("menu");
        contextElement.style.top = event.offsetY + "px";
        contextElement.style.left = event.offsetX + "px";
        contextElement.style.display = "inline-block";
        contextElement.classList.add("active");
    });
    window.addEventListener("click",function()
    {
        document.getElementById("menu").classList.remove("active");
        document.getElementById("menu").style.display = "none";
    });
}


//Loads Moon and Stars
function NightSkyInit()
{
    window.MoonTexture = new THREE.TextureLoader().load( '/textures/moon.jpg' );
    window.MoonMaterial = new THREE.MeshPhongMaterial({
        color: 0xff5808,
        bumpMap: MoonTexture,
        map: MoonTexture,
        bumpScale: 0.45, 
        emissive : 0xff5808
    });
    MoonMaterial.emmisiveIntensity = 0.2;

    window.MoonGeo = new THREE.SphereGeometry(100, 32, 32, 0 , Math.PI*2 ,   0, Math.PI*2);
    window.Moon = new THREE.Mesh(window.MoonGeo,window.MoonMaterial);
    window.Moon.name = "Moon";

    //moon
    window.Moon.position.set(500,250,-500);
    window.Moon.castShadow = true;

    window.StarMaterial = new THREE.MeshPhongMaterial( { color: 0xff5808, emissive :0xfcba03} );
    window.StarMaterial.emmisiveIntensity = 1.5;
    window.StarGeo = new THREE.SphereGeometry(1, 32, 32, 0 , Math.PI*2 ,   0, Math.PI*2);
    window.Star = new THREE.Mesh(window.StarGeo,window.StarMaterial);
    window.Star.position.set(0,150,0);

}

//Procedural Star Generator
function StarsGen(parameter)
{
    
    this.mesh = parameter.clone();   
    this.addModel = function(i)
    {
    var starModel = this.mesh.clone();
    starModel.castShadow = true;
    starModel.name = "Star-" + i;
    starModel.position.x= -300 + Math.floor((Math.random() * 1000));
    starModel.position.y= 300+ Math.floor((Math.random() * 300));;
    starModel.position.z= -300 + Math.floor((Math.random() * 1000));
    scene.add(starModel);
  }
}

//Procedural Tree Generator
function treeGen(TreeArrayParameter,i)
{
    this.mesh = TreeArrayParameter[i].clone()

    this.addModel = function()
    {
    var newModel = this.mesh.clone();
    newModel.castShadow = true;
    newModel.name = "Tree-" + i;
    newModel.position.x= 0 + Math.floor((Math.random() * 25));
    newModel.position.y= 0;
    newModel.position.z= 0 + Math.floor((Math.random() * 25));
    scene.add(newModel);
  }   
}   



//create trees, house.
function CreateStructures()
{

    //Create Textures
    var PlaneTexture = new THREE.TextureLoader().load( '/textures/grasslight-small.jpg' );
    var TreeTexture1 = new THREE.TextureLoader().load( '/textures/treeleaves1.jpg' );
    var TreeTexture2 = new THREE.TextureLoader().load( '/textures/treeleaves2.jpg' );
    var TreeTexture3 = new THREE.TextureLoader().load( '/textures/grasslight-small.jpg' );
    
    var BrickTexture = new THREE.TextureLoader().load( '/textures/bricks.jpg' );
    var IglooTexture = new THREE.TextureLoader().load( '/textures/igloo.jpg' );
    var PondTexture = new THREE.TextureLoader().load( '/textures/pond.jpg' );
    var RoofTexture = new THREE.TextureLoader().load( '/textures/rooftiles.jpg' );
    var TreeTrunkTexture = new THREE.TextureLoader().load( '/textures/treebark.jpg' );
    

    // create the ground plane
    var PlaneMaterial = new THREE.MeshPhongMaterial({shininess: 100,bumpMap: PlaneTexture,map: PlaneTexture, bumpScale  :  0.85});
    var planeGeometry = new THREE.PlaneGeometry(180, 180);
    var plane = new THREE.Mesh(planeGeometry, PlaneMaterial);
    plane.receiveShadow = true;


    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);

    // add the plane to the scene
    scene.add(plane);    

    //Materials
    var WaterTankMaterial = new THREE.MeshPhongMaterial( { color: 0x0000FF, shininess: 100} );
    var PondMaterial = new THREE.MeshPhongMaterial({bumpMap: PondTexture,map: PondTexture,bumpScale: 0.85, shininess: 200, specular: 100});

    var IglooMaterial = new THREE.MeshPhongMaterial({bumpMap: IglooTexture,map: IglooTexture,bumpScale: 0.45, shininess: 100});
    var HouseBaseMaterial = new THREE.MeshPhongMaterial({bumpMap: BrickTexture,map: BrickTexture,bumpScale: 0.45, shininess: 100});
    var HouseTopMaterial = new THREE.MeshPhongMaterial({bumpMap: RoofTexture,map: RoofTexture,bumpScale: 0.45, shininess: 100});

    var TreeBaseMaterial = new THREE.MeshPhongMaterial({bumpMap: TreeTrunkTexture,map: TreeTrunkTexture,bumpScale: 0.45});
    var LeavesMaterial1 = new THREE.MeshPhongMaterial({bumpMap: TreeTexture1,map: TreeTexture1,bumpScale: 0.45, shininess: 100});
    var LeavesMaterial2 = new THREE.MeshPhongMaterial({bumpMap: TreeTexture2,map: TreeTexture2,bumpScale: 0.45, shininess: 100});
    var LeavesMaterial3 = new THREE.MeshPhongMaterial({bumpMap: TreeTexture3,map: TreeTexture3,bumpScale: 0.45, shininess: 100});


    //Geometries
    var WaterTankGeo = new THREE.CylinderGeometry(10, 10, 15, 64);
    var PondGeo = new THREE.CylinderGeometry( 15, 15, 1, 64 );
    var IglooGeo = new THREE.SphereGeometry(20, 32, 32, 0 , Math.PI ,   0, Math.PI);

    var HouseBaseGeo = new THREE.BoxGeometry(30,10,15);
    var HouseTopGeo = new THREE.CylinderGeometry(10, 10 , 40, 3);

    var TreeBaseGeo1 = new THREE.CylinderGeometry(3, 3, 3, 64);
    var TreeTopGeo1 = new THREE.CylinderGeometry(0, 5, 10, 64);
    var TreeTopGeo1A = new THREE.CylinderGeometry(0, 5, 10, 64);

    var TreeBaseGeo2 = new THREE.CylinderGeometry(3, 3, 7, 64);
    var TreeTopGeo2 = new THREE.CylinderGeometry(0, 5, 20, 64);

    var TreeBaseGeo3 = new THREE.CylinderGeometry(3, 3, 3, 64);
    var TreeTopGeo3 = new THREE.CylinderGeometry(0, 5, 10, 64);
    

    //Meshes
    var WaterTank = new THREE.Mesh(WaterTankGeo, WaterTankMaterial);
    var Pond = new THREE.Mesh( PondGeo, PondMaterial );
    var Igloo = new THREE.Mesh(IglooGeo, IglooMaterial);

    var HouseBase = new THREE.Mesh(HouseBaseGeo, HouseBaseMaterial);
    var HouseTop = new THREE.Mesh(HouseTopGeo, HouseTopMaterial);



    var TreeBase1 = new THREE.Mesh(TreeBaseGeo1, TreeBaseMaterial);
    var TreeTop1 = new THREE.Mesh(TreeTopGeo1, LeavesMaterial1);
    var TreeTop1A = new THREE.Mesh(TreeTopGeo1A, LeavesMaterial1);
    var TreeBase2 = new THREE.Mesh(TreeBaseGeo2, TreeBaseMaterial);
    var TreeTop2 = new THREE.Mesh(TreeTopGeo2, LeavesMaterial2);
    var TreeBase3 = new THREE.Mesh(TreeBaseGeo3, TreeBaseMaterial);
    var TreeTop3 = new THREE.Mesh(TreeTopGeo3, LeavesMaterial3);


    //Make house
    HouseBase.castShadow = true;
    HouseBase.receiveShadow = true;
    HouseBase.position.set(0,5,-60);


    //Make house top   
    HouseTop.castShadow = true;
    HouseTop.receiveShadow = true;
    HouseTop.rotation.x = -0.5 * Math.PI;
    HouseTop.rotation.z = 0.5 * Math.PI;

    HouseTop.position.set(0,15,-60);
    var House = new THREE.Group();
    House.add(HouseBase);
    House.add(HouseTop);
    scene.add(House);

    //create water tank
    WaterTank.castShadow = true;
    WaterTank.receiveShadow = true;
    WaterTank.receiveShadow = true;
    WaterTank.position.set(-50,5,-35);
    scene.add(WaterTank);

    //create pond      
    Pond.receiveShadow = true;
    Pond.position.set(-30,0,-10);
    scene.add(Pond);

    //create igloo    
    Igloo.rotation.x = -0.5 * Math.PI;
    Igloo.castShadow = true;
    Igloo.receiveShadow = true;
    Igloo.receiveShadow = true;

    Igloo.position.set(-40,0,40);
    scene.add(Igloo);
  
    //TRees
    TreeBase1.castShadow = true;
    TreeBase1.receiveShadow = true;
    TreeBase1.position.set(40,0.5,40);
      
    TreeTop1.castShadow = true;
    TreeTop1.receiveShadow = true;
    TreeTop1.position.set(40,7,40);
    
    TreeTop1A.castShadow = true;
    TreeTop1A.receiveShadow = true;
    TreeTop1A.position.set(40,12,40);

    var Tree1 = new THREE.Group();
    Tree1.add(TreeBase1);
    Tree1.add(TreeTop1);
    Tree1.add(TreeTop1A);

    //Tree 2  
    TreeBase2.castShadow = true;
    TreeBase2.receiveShadow = true;
    TreeBase2.position.set(0,3,50);
    
    TreeTop2.castShadow = true;
    TreeTop2.receiveShadow = true;
    TreeTop2.position.set(0,15,50);

    var Tree2 = new THREE.Group();
    Tree2.add(TreeBase2);
    Tree2.add(TreeTop2);

    //Tree 3
    TreeBase3.castShadow = true;
    TreeBase3.receiveShadow = true;
    TreeBase3.position.set(50,2,-50);
   
    TreeTop3.castShadow = true;
    TreeTop3.receiveShadow = true;
    TreeTop3.position.set(50,7,-50);

    var Tree3 = new THREE.Group();
    Tree3.add(TreeBase3);
    Tree3.add(TreeTop3);

    var TreeMeshArray = [Tree1,Tree2,Tree3];

    var treeModel1 = new treeGen(TreeMeshArray,0);
    var treeModel2 = new treeGen(TreeMeshArray,1);
    var treeModel3 = new treeGen(TreeMeshArray,2);

    //Generates between 3 and 12 Trees
    for(var i = 0; i < Math.round(Math.random() * 10)+3; i++)
    {
        treeModel1.addModel();
        treeModel2.addModel();
        treeModel3.addModel();
    }  
}



//Initializes lighting Parameters
function CreateLighting() 
{
    
    directionalLight.position.set(-80, 80, -80);
    directionalLight.castShadow = true;

    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 75;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.distance = 0;//for constant attenuation
    directionalLight.intensity = 1;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;

    pointLight1.position.set(-100,0,-100);
    pointLight1.castShadow = true;

    pointLight2.position.set(-100,0,100);
    pointLight2.castShadow = true;

    pointLight3.position.set(100,0,0);
    pointLight3.castShadow = true;

    if(DayScene)
    {
      scene.add(directionalLight);
    }
}

//Creates GUI onscreen with buttons and sliders
function CreateGUI()
{
    var gui = new dat.GUI();
    gui.domElement.id = 'gui';


    guiRotation = gui.addFolder('Rotation');
    guiRotation.add(controls, 'ToggleRotation');
    gui.add(controls, 'Rotating').listen();
    gui.add(controls, 'Direction').listen();
    guiRotation.add(controls, 'ToggleDirection');
    guiRotation.add(controls, 'RotationSpeed', 0, 1);

    guiZoom = gui.addFolder('Zoom');
    guiZoom.add(controls, 'Scale',0.5 ,10);

    //day night
    guiDay = gui.addFolder("Day/Night");
    guiDay.add(controls, 'ToggleScene');
    gui.add(controls, 'Scene').listen();


    //Menu Functions
    document.getElementById("Toggle-Direction").onclick = function () 
    {
        if(RotationClockwise)
        {
            controls.Direction = "Anti Clockwise";
            RotationClockwise = false;
        }
        else
        {
            controls.Direction = "Clockwise";
            RotationClockwise = true;
        }
    };
    document.getElementById("Toggle-Scene").onclick = function () 
    {
        if(DayScene)
        {
      //      scene.background = new THREE.Color(0x000000); //FFFF for day, 00000 for night
         //scene.add(pointLight);
     //   scene.remove(scene.getObjectByName("Sun") );

            controls.Scene = "Night Scene";

            DayScene = false;
            CreateLighting();
        }
        else
        {
     //       scene.add(directionalLight);
   //      scene.remove(scene.getObjectByName("point1") );
     //    scene.background = new THREE.Color(0xFFFFFFF); //FFFF for day, 00000 for night  

            controls.Scene = "Day Scene";
            DayScene = true;
            CreateLighting();
        }
    };         
}

//Right-Click Menu
function CreateControls()
{
    //Create Controls
    controls = new function () 
    {
        this.Scale = 1.0;
        this.RotationSpeed = 0.01;
        this.visible = true;
        this.Rotating = "Not Rotating";
        this.Direction = "Clockwise";
        this.Scene = "Day";
        this.ToggleRotation = function()
        {
            this.Rotating = "Not Rotating";
            if(ToggleRotation)
            {
                ToggleRotation = false;
                this.Rotating = "Not Rotating";
            }

            else
            {
                ToggleRotation = true;
                this.Rotating = "Rotating";
            }

        }
        this.ToggleDirection = function()
        {
            if(RotationClockwise)
            {
                this.Direction = "Anti Clockwise";
                RotationClockwise = false;
            }
            else
            {
                this.Direction = "Clockwise";
                RotationClockwise = true;
            }
        }
        this.ToggleScene = function()
        {
            if(DayScene)
            {
                this.Scene = "Night Scene";
                DayScene = false;
            }
            else
            {
                this.Scene = "Day Scene";
                DayScene = true;
            }
        }        
    };

    document.getElementById("Quit").onclick = function () 
    {
        window.close();
        alert("window.close() has been depecated");
    };      
    
    document.getElementById("Zoom-In").onclick = function () 
    {
        if((controls.Scale >= 0.5) && (controls.Scale <= 9.5)) 
        {
            controls.Scale += 0.5;
        }
    };      
    document.getElementById("Zoom-Out").onclick = function () 
    {
        if((controls.Scale >= 1) && (controls.Scale <= 10))
        {
            controls.Scale -= 0.5;
        }
    };
}

//Creates and Initializes Camera
function CreateCamera()
{
    //Initialize  camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    orbit = new THREE.OrbitControls(camera);

    // position and point the camera
    camera.position.y = 50;
    camera.position.x = -200 * ( Math.cos(Theta));
    camera.position.z = 200 * (Math.sin(Theta));
    camera.lookAt(scene.position.x,scene.position.y+20,scene.position.z);  
}

//Displays Stats
function initStats() 
{      
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
}

//Render Function
function render() 
{  
    stats.update();
    if(ToggleRotation)
    {
        if(RotationClockwise)  {Theta += (controls.RotationSpeed/20);}
        else{Theta -= (controls.RotationSpeed/20);}
        
        //rotate camera
        camera.position.x = 200 * ( Math.cos(Theta));
        camera.position.z = 200 * (Math.sin(Theta)); 
        camera.lookAt(scene.position.x,scene.position.y+20,scene.position.z);//maybe height
    }
    else
    {
        //Orbit controls
        orbit.update();
    }
    camera.zoom = controls.Scale;
    camera.updateProjectionMatrix();

    if (DayScene)
    {
        //Once off check if scene is day or night
        if(scene.getObjectByName("Sun") == null )
        {
            scene.add(directionalLight);            
        }
        scene.remove(scene.getObjectByName("point1") );
        scene.remove(scene.getObjectByName("point2") );
        scene.remove(scene.getObjectByName("point3") );
        scene.remove(scene.getObjectByName("Moon") );

        for(var i = 0; i <  50; i++)
        {
            scene.remove(scene.getObjectByName("Star-"+i) );
        }  
        scene.background = new THREE.Color(0xFFFFFFF); //FFFF for day, 00000 for night
    }
    else
    {
        if(scene.getObjectByName("point1") == null )
        {

            scene.add(pointLight1);
            scene.add(pointLight2);
            scene.add(pointLight3);
            scene.add(window.Moon);

            //Add Stars
            var StarsModel = new StarsGen(window.Star);
            for(var i = 0; i <  50; i++)
            {
                StarsModel.addModel(i);
            }
        }
        scene.remove(scene.getObjectByName("Sun") );
        scene.background = new THREE.Color(0x000000); //FFFF for day, 00000 for night
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//Initialization
function init() {

    //initialize Stats
    var stats = initStats();
    //Initialize scene
    scene = new THREE.Scene();        
    scene.background = new THREE.Color(0xFFFFFFF); //FFFF for day, 00000 for night

    //Initialize render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; 
    
       

    // add the output of the renderer to html
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    CreateStructures();
    NightSkyInit();
    CreateLighting();
    CreateCamera(); 
    CreateControls();
    CreateGUI();
    Menu();
    render();

}
window.onload = init;

// listen to the resize events
window.addEventListener('resize', onResize, false);

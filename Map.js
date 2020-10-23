function MapForDungeonCrawler(w,h){
    this.mapwidth=w
    this.mapheight=h

    //Map Datas
    this.RowWalls=Array(mapwidth)
    this.ColWalls=Array(mapwidth+1)
    this.PlacedFloor=Array(mapwidth)
    this.PlacedIcon=Array(mapwidth)
    this.PlacedMemo=Array(mapwidth)

    this.IconUsing=0;
    this.IconClassNames=["","UpStair","DownStair","Door"]
    

    this.InitMapDatas=function(){
	RowWalls=Array(mapwidth)
	ColWalls=Array(mapwidth+1)
	PlacedFloor=Array(mapwidth)
	PlacedIcon=Array(mapwidth)
	PlacedMemo=Array(mapwidth)
	for(i=0;i<mapwidth;i++){
	    RowWalls[i]=Array(mapheight+1).fill(0)
	    ColWalls[i]=Array(mapheight).fill(0)
	    PlacedFloor[i]=Array(mapheight).fill(0)
	    PlacedIcon[i]=Array(mapheight).fill(0)
	    PlacedMemo[i]=Array(mapheight).fill(0)
	}
	ColWalls[mapwidth]=Array(mapheight).fill(0)
    }
    
    this.ChangeCellSize=function(){
	//set css
	console.log("Changing Cell Size")
	width=$("#map_main").width()
	$(".cell").css({"width":width/mapwidth+"px","height":width/mapwidth+"px"})
    }
    
    this.CreateCells=function(){
	//create map elements
	for(i=0;i<mapheight*mapwidth;i++){
	    $("<div></div>").addClass("cell").attr("id",i+"_cell").appendTo($("#map_main"))
	}
	ChangeCellSize()
	$(window).resize(ChangeCellSize)
    }

    
    this.UnbindPreviousTool=function(){
	//Hay, just unbind everything.
	UnbindPencil()
	UnbindBrush()
	UnbindEraser()
	UnbindWiper()
	UnbindIcon()
    }
    
    // Brush functions
    this.UseBrush=function(Cell){
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedFloor[x][y]=1
	Cell.addClass("Painted")
    }
    this.BindBrush=function(){
	$(".cell").each(function(){
	    $(this).click(function(){
		UseBrush($(this))
	    })
	})
    }
    this.UnbindBrush=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
    }
    
    // Wiper functions
    this.UseWiper=function(Cell){
	Cell.removeClass("Painted")
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedFloor[x][y]=0
    }
    this.BindWiper=function(){
	$(".cell").each(function(){
	    $(this).click(function(){
		UseWiper($(this))
	    })
	})
    }
    this.UnbindWiper=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
    }

    this.UpdateFloor=function(x,y){
	if(PlacedFloor[x][y]!=0){
	    $("#"+(x+y*mapwidth)+"_cell").addClass("Painted")
	}
	else if(PlacedFloor[x][y]==0){
	    $("#"+(x+y*mapwidth)+"_cell").removeClass("Painted")
	}
    }

    // Pencil function
    this.UsePencil=function(MapMain){
	x=event.pageX-MapMain.offset().left
	y=event.pageY-MapMain.offset().top
	cellsize=$(".cell").outerWidth()
	pointX=x/cellsize
	pointY=y/cellsize
	candidateX=Math.round(pointX)
	candidateY=Math.round(pointY)
	threshold=0.2
	
	if(Math.abs(pointX-candidateX)<threshold){
	    console.log("Drawn Column",candidateX,candidateY,pointX,pointY)
	    ColWalls[candidateX][Math.floor(pointY)]=1
	    UpdateColumnWall(candidateX,Math.floor(pointY))
	}
	else if(Math.abs(pointY-candidateY)<threshold){
	    console.log("Drawn Row",candidateX,candidateY,pointX,pointY)
	    RowWalls[Math.floor(pointX)][candidateY]=1
	    UpdateRowWall(Math.floor(pointX),candidateY)
	}
    }
    this.BindPencil=function(){
	$("#map_main").click(function(event){
	    UsePencil($(this))
	})
    }
    this.UnbindPencil=function(){
	$("#map_main").unbind("click")
    }

    // Eraser function
    this.UseEraser=function(MapMain){
	x=event.pageX-MapMain.offset().left
	y=event.pageY-MapMain.offset().top
	cellsize=$(".cell").outerWidth()
	pointX=x/cellsize
	pointY=y/cellsize
	candidateX=Math.round(pointX)
	candidateY=Math.round(pointY)
	threshold=0.2
	
	if(Math.abs(pointX-candidateX)<threshold){
	    console.log("Erased Column",candidateX,candidateY,pointX,pointY)
	    ColWalls[candidateX][Math.floor(pointY)]=0
	    UpdateColumnWall(candidateX,Math.floor(pointY))
	}
	else if(Math.abs(pointY-candidateY)<threshold){
	    console.log("Erased Row",candidateX,candidateY,pointX,pointY)
	    RowWalls[Math.floor(pointX)][candidateY]=0
	    UpdateRowWall(Math.floor(pointX),candidateY)
	}
    }
    this.BindEraser=function(){
	$("#map_main").click(function(event){
	    UseEraser($(this))
	})
    }
    this.UnbindEraser=function(){
	$("#map_main").unbind("click")
    }

    //Updates column wall
    function UpdateColumnWall(i,j){
	var colx=ColWalls.length
	var coly=ColWalls[0].length
	var Cells=$(".Cell")	
	if(i==0){
	    if(ColWalls[i][j]==1){
		$(Cells[j*(colx-1)+i]).addClass("Left")
	    }
	    else if(ColWalls[i][j]==0){
		$(Cells[j*(colx-1)+i]).removeClass("Left")
	    }
	}
	else{
	    if(ColWalls[i][j]==1){
		$(Cells[j*(colx-1)+i-1]).addClass("Right")
	    }
	    else if(ColWalls[i][j]==0){
		$(Cells[j*(colx-1)+i-1]).removeClass("Right")
	    }
	}
    }
    
    function UpdateRowWall(i,j){
	var rowx=RowWalls.length
	var rowy=RowWalls[0].length
	var Cells=$(".Cell")	
	if(j==0){
	    if(RowWalls[i][j]==1){
		$(Cells[j*rowx+i]).addClass("Top")
	    }
	    else if(RowWalls[i][j]==0){
		$(Cells[j*rowx+i]).removeClass("Top")
	    } 
	}
	else{
	    if(RowWalls[i][j]==1){
		$(Cells[(j-1)*rowx+i]).addClass("Bottom")		    
	    }
	    else if(RowWalls[i][j]==0){
		$(Cells[(j-1)*rowx+i]).removeClass("Bottom")		    
	    }
	}
    }
    
    //Icon Functions
    this.UseIcon=function(Cell){
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedIcon[x][y]=IconUsing
	if(IconUsing==0){
	    for(i=1;i<IconClassNames.length;i++){
		Cell.removeClass(IconClassNames[i])
	    }
	}
	else{
	    Cell.addClass(IconClassNames[IconUsing])
	}
    }
    
    this.UpdateIcon=function(x,y){
	if(PlacedIcon[x][y]!=0){
	    $("#"+(x+y*mapwidth)+"_cell").addClass(IconClassNames[PlacedIcon[x][y]])
	}
    }

    this.BindIcon=function(icon){
	IconUsing=icon
	$(".cell").each(function(){
	    $(this).click(function(){
		UseIcon($(this))
	    })
	})
    }
    this.UnbindIcon=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
    }

    this.ParseAndUpdateData=function(Data){
	Data=Data.split(",")
	mapwidth=parseInt(Data.shift())
	mapheight=parseInt(Data.shift())
	InitMapDatas()
	console.log(RowWalls)
	for(i=0;i<RowWalls.length;i++){
	    for(j=0;j<RowWalls[0].length;j++){
		RowWalls[i][j]=parseInt(Data.shift())
	    }
	}
	for(i=0;i<ColWalls.length;i++){
	    for(j=0;j<ColWalls[0].length;j++){
		ColWalls[i][j]=parseInt(Data.shift())
	    }
	}
	for(i=0;i<PlacedFloor.length;i++){
	    for(j=0;j<PlacedFloor[0].length;j++){
		PlacedFloor[i][j]=parseInt(Data.shift())
	    }
	}
	for(i=0;i<PlacedIcon.length;i++){
	    for(j=0;j<PlacedIcon[0].length;j++){
		PlacedIcon[i][j]=parseInt(Data.shift())
	    }
	}
    }
    
    this.LoadData=function(){
	$("<div class='Curtain'></div>").appendTo($("body"))
	$("<div id='InputWindow' class='Window'></div>").text("Copy and paste your data here.")
					.appendTo($("body"))
	$("<form id='InputForm' action=''></form>").appendTo($("#InputWindow"))
	$("<textarea type='text' class='Data' id='InputData' name='data'>").appendTo($("#InputForm"))
	$("<button type='submit' id='SubmitData'>Submit</button>").appendTo($("#InputForm"))
	$("<button type='button'>Close</button>")
					.click(function(){
					    $("#InputWindow").remove()
					    $(".Curtain").remove()
					})
					.appendTo($("#InputForm"))
	$("#InputForm").submit(function(event){
	    event.preventDefault()
	    var Data=$("#InputData").val()
	    $("#InputWindow").remove()
	    $(".Curtain").remove()
	    $(".cell").remove()
	    ParseAndUpdateData(Data)
	    CreateCells()
	    UpdateWholeMap()
	})
    }
    
    this.ExportData=function(){
	var data=""
	data+=mapwidth+","+mapheight
	for(i=0;i<RowWalls.length;i++){
	    for(j=0;j<RowWalls[0].length;j++ ){
		data+=","+RowWalls[i][j]
	    }
	}
	for(i=0;i<ColWalls.length;i++){
	    for(j=0;j<ColWalls[0].length;j++ ){
		data+=","+ColWalls[i][j]
	    }
	}
	for(i=0;i<PlacedFloor.length;i++){
	    for(j=0;j<PlacedFloor[0].length;j++ ){
		data+=","+PlacedFloor[i][j]
	    }
	}
	for(i=0;i<PlacedIcon.length;i++){
	    for(j=0;j<PlacedIcon[0].length;j++ ){
		data+=","+PlacedIcon[i][j]
	    }
	}	

	$("<div class='Curtain'></div>").appendTo($("body"))
	$("<div id='ExportWindow' class='Window'></div>")
					.text("Copy and paste this to your local file.")
					.appendTo($("body"))
	$("<div class='Data'></div>").text(data).appendTo($("#ExportWindow"))
	$("<button type='button'>Close</button>")
					.click(function(){
					    $("#ExportWindow").remove()
					    $(".Curtain").remove()
					})
					.appendTo($("#ExportWindow"))
    }
    
    this.Init=function(){
	console.log("Map:Init")
	InitMapDatas()
	CreateCells()
	BindBrush()
	$("#pencil").click(function(){
	    UnbindPreviousTool()
	    BindPencil()
	})
	$("#brush").click(function(){
	    UnbindPreviousTool()
	    BindBrush()
	})
	$("#wiper").click(function(){
	    UnbindPreviousTool()
	    BindWiper()
	})
	$("#eraser").click(function(){
	    UnbindPreviousTool()
	    BindEraser()
	})
	$(".icon").each(function(index){
	    $(this).click(function(){
		UnbindPreviousTool()
		BindIcon(index)
	    })
	})
	$("#Load").click(LoadData)
	$("#Export").click(ExportData)
	
    }
    
    //Updates whole map
    function UpdateWholeMap(){
	var rowx=RowWalls.length
	var rowy=RowWalls[0].length
	var colx=ColWalls.length
	var coly=ColWalls[0].length
	for(i=0;i<rowx;i++){
	    for(j=0;j<rowy;j++){
		UpdateRowWall(i,j)
	    }
	}
	for(i=0;i<colx;i++){
	    for(j=0;j<coly;j++){
		UpdateColumnWall(i,j)
	    }
	}
	for(i=0;i<mapwidth;i++){
	    for(j=0;j<mapheight;j++){
		UpdateFloor(i,j)
		UpdateIcon(i,j)
	    }
	}
    }
    return this
}

var Map=MapForDungeonCrawler(30,30)
Map.Init()

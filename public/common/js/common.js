// 필드 미리 글써놓기
function ClearField(field){
	if (field.value == field.defaultValue) {
		field.value = "";
	}
}

function FillField(field){
	if (!field.value) {
		field.value = field.defaultValue;
	}
}
// 필드 미리 글써놓기

function open_window(name, url, left, top, width, height, toolbar, menubar, statusbar, scrollbar, resizable){
  toolbar_str = toolbar ? 'yes' : 'no';
  menubar_str = menubar ? 'yes' : 'no';
  statusbar_str = statusbar ? 'yes' : 'no';
  scrollbar_str = scrollbar ? 'yes' : 'no';
  resizable_str = resizable ? 'yes' : 'no';
  window.open(url, name, 'left='+left+',top='+top+',width='+width+',height='+height+',toolbar='+toolbar_str+',menubar='+menubar_str+',status='+statusbar_str+',scrollbars='+scrollbar_str+',resizable='+resizable_str);
}


// 한글 입력 검색
function hangul_chk(word) {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-";
	
	for (i=0; i< word.length; i++)
	{
		idcheck = word.charAt(i);
		
		for ( j = 0 ;  j < str.length ; j++){
		
			if (idcheck == str.charAt(j)) break;
				
     			if (j+1 == str.length){
   				return false;
     			}
     		}
     	}
     	return true;
}

function noSpChar(str) 
    { 
        str=str.toUpperCase(); 
        checking=1 
        for (i=0;i<str.length;i++) 
        { 
            if((str.charCodeAt(i)<65 && (str.charCodeAt(i)!=64) && (str.charCodeAt(i)!=46) && !(str.charCodeAt(i)>=48 && str.charCodeAt(i)<=57)) || str.charCodeAt(i)>90 || (str.charAt(0) >= "0" && str.charAt(0) <= "9" )) 
            { 
                checking=0 
            } 
        }
        return (checking); 
    } 

// 이메일 입력 검색
function email_chk(word) {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-._@";
	
	for (i=0; i< word.length; i++)
	{
		idcheck = word.charAt(i);
		
		for ( j = 0 ;  j < str.length ; j++){
		
			if (idcheck == str.charAt(j)) break;
				
     			if (j+1 == str.length){
   				return false;
     			}
     		}
     	}
     	return true;
}

function addComma (str){
	var input_str = String(str);

	if (input_str == '') return false;
	input_str = parseInt(input_str.replace(/[^0-9]/g, '')).toString();
	if (isNaN(input_str)) { return false; }

	var sliceChar = ',';
	var step = 3;
	var step_increment = -1;
	var tmp  = '';
	var retval = '';
	var str_len = input_str.length;

	for (var i=str_len; i>=0; i--)	{
		tmp = input_str.charAt(i);
		if (tmp == sliceChar) continue;
		if (step_increment%step == 0 && step_increment != 0) retval = tmp + sliceChar + retval;
		else retval = tmp + retval;
		step_increment++;
	}

	return retval;
}

function zipSearch(tp){
	obj = window.open('/module/zipcode/zipcode.php?tp='+tp,'주소찾기','width=463, height=305, scrollbars=1');
}

function startPage(Obj,urlStr){
    if (document.all && window.external){
        Obj.style.behavior='url(#default#homepage)';
        Obj.setHomePage(urlStr);
    } else {
        
    }
}

//배너체크
function go_banner(idx, url, tar){
	if(idx !=""){
		new Ajax.Request('/module/banner/ajax_count_banner.php',
		{
			method:'get',
			parameters: {idx: idx},
			encoding: 'utf-8',
			//contentType: 'application/x-www-form-urlencoded',

			onSuccess: function(transport){
				var response = transport.responseText; 
				if(response=="1"){
						go_banner_page(idx, url, tar);
				}
			},
			
			onFailure: function(){ 
				alert('Something went wrong...') 
			}   
		});
	}
}

function go_banner_page(idx,url,tar){
	if(tar=="_blank"){
		obj = window.open(url,idx,"");
	}else{
		window.location.href = url;
	}
}

//일반회원가입시 수취인
function memberShipInfoAssign(st){
	f = document.memberForm;
	if(st==true){
		f.etc_2.value = f.user_name.value;
		f.tel_1.value = f.phone_1.value;
		f.tel_2.value = f.phone_2.value;
		f.tel_3.value = f.phone_3.value;
	}else{
		f.etc_2.value = "";
		f.tel_1.value = "";
		f.tel_2.value = "";
		f.tel_3.value = "";
	}
}

//법인회원가입시 
function comp1ShipInfoAssign(st){
	f = document.memberForm;
	if(st==true){
		f.etc_51.value = f.user_name.value;
	}else{
		f.etc_51.value = "";
	}
}
function comp2ShipInfoAssign(st){
	f = document.memberForm;
	if(st==true){
		f.etc_52.value = f.mobile_1.value;
		f.etc_53.value = f.mobile_2.value;
		f.etc_54.value = f.mobile_3.value;
	}else{
		f.etc_52.value = "";
		f.etc_53.value = "";
		f.etc_54.value = "";
	}
}
function comp3ShipInfoAssign(st){
	f = document.memberForm;
	if(st==true){
		f.etc_55.value = f.email_id.value;
		f.etc_56.value = f.email_domain.value;
	}else{
		f.etc_55.value = "";
		f.etc_56.value = "";
	}
}
function comp4ShipInfoAssign(st){
	f = document.memberForm;
	if(st==true){
		f.etc_2.value = f.user_name.value;
		f.tel_1.value = f.phone_1.value;
		f.tel_2.value = f.phone_2.value;
		f.tel_3.value = f.phone_3.value;
		f.zip1.value = f.com_zip1.value;
		f.zip2.value = f.com_zip2.value;
		f.address.value = f.com_address.value;
		f.address_ext.value = f.com_address_ext.value;
	}else{
		f.etc_2.value = "";
		f.tel_1.value = "";
		f.tel_2.value = "";
		f.tel_3.value = "";
		f.zip1.value = "";
		f.zip2.value = "";
		f.address.value = "";
		f.address_ext.value = "";
	}
}

function execDaumPostcode(gb) {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var fullAddr = ''; // 최종 주소 변수
			var extraAddr = ''; // 조합형 주소 변수

			// 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				fullAddr = data.roadAddress;

			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				fullAddr = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 조합한다.
			if(data.userSelectedType === 'R'){
				//법정동명이 있을 경우 추가한다.
				if(data.bname !== ''){
					extraAddr += data.bname;
				}
				// 건물명이 있을 경우 추가한다.
				if(data.buildingName !== ''){
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
				fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			if(gb=="2") {
				document.getElementById('ship_postcode').value = data.zonecode; //5자리 새우편번호 사용
				document.getElementById('ship_address').value = fullAddr;

				// 커서를 상세주소 필드로 이동한다.
				document.getElementById('ship_address2').focus();
			}else if(gb=="4") {
				document.getElementById('o_postcode').value = data.zonecode; //5자리 새우편번호 사용
				document.getElementById('o_address').value = fullAddr;

				// 커서를 상세주소 필드로 이동한다.
				document.getElementById('o_address2').focus();
			}else if(gb=="5") {
				document.getElementById('s_postcode').value = data.zonecode; //5자리 새우편번호 사용
				document.getElementById('s_address').value = fullAddr;

				// 커서를 상세주소 필드로 이동한다.
				document.getElementById('s_address2').focus();
			}else if(gb=="3") {
				document.getElementById('p_postcode').value = data.zonecode; //5자리 새우편번호 사용
				document.getElementById('p_address').value = fullAddr;

				// 커서를 상세주소 필드로 이동한다.
				document.getElementById('p_address2').focus();
			} else {
				document.getElementById('postcode').value = data.zonecode; //5자리 새우편번호 사용
				document.getElementById('address').value = fullAddr;

				// 커서를 상세주소 필드로 이동한다.
				document.getElementById('address2').focus();
			}
		}
	}).open();
}

function setEmailDom(frm,val){
		frm.email_domain.value = val;
		if(val==""){
			frm.email_domain.focus();
		}
}


function nl2br (str) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  const breakTag = '<br>';
  return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1');
}
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./TagRates.sol";
import "../token/TagNFT.sol";

contract TagTreasury is Ownable  {
    using SafeMath for uint256;

    TagNFT public TagT;

    TagRates public TagR;

    bool private active;

    address private masterAddress;

    mapping ( uint256 => Limits ) private  Levels;

    struct Limits{
        uint256 percent;
        uint256 salesLimit;
    }

    uint256 private MaxLevel;

    mapping ( address => userData ) private  Users;

    struct userData{
        address parent;
        uint256 level;
        uint256 sales;
        uint256 share;
    }

    modifier isValidValue (){
        require( msg.value >= TagR.fetchPrice());
        _;
    }

    modifier isVaildClaim( uint256 _amt ){
        require( Users[ msg.sender ].share >= _amt );
        _;
    }

    modifier isVaildReferer( address _ref ){
        require( Users[ _ref ].level != 0 );
        _;
    }

    modifier isActive(  ){
        require( active == true );
        _;
    }

    modifier isInactive(  ){
        require( active == false );
        _;
    }

    event puchaseEvent( address indexed _buyer , address indexed _referer , uint256 _value , uint256 _tokens , string tokenName );

    event alloc( address indexed _address , uint256 _share );

    event claimEvent( address indexed _buyer ,  uint256 _value , uint256 _pendingShare );

    event changeLevel( address indexed _address , uint256 Level);

    constructor ( address _tagT , address _tagR ) Ownable() public {
        TagT = TagNFT(_tagT);
        TagR = TagRates(_tagR);
    }

    function changeRateContract( address _tagR ) onlyOwner public returns ( bool ) {
        TagR = TagRates(_tagR);
        return true;
    }

    function changeMaster( address _master ) onlyOwner public returns ( bool ) {
        masterAddress = _master;
        Users[_master].level = MaxLevel;
        return true;
    }

    function setMaxLevel( uint256 _MaxLevel ) onlyOwner  public returns ( bool ) {
        MaxLevel = _MaxLevel;
        return true;
    }

    function setLevel( uint256 _Level , uint256 _percent , uint256 _salesLevel ) onlyOwner  public returns ( bool ) {
        Levels[_Level] = Limits( _percent , _salesLevel );
        return true;
    }

    function setUser( address _child , address parent , uint256 level , uint256 sales , uint256 share ) onlyOwner  public returns ( bool ) {
        Users[_child ] = userData( parent , level , sales , share );
        return true;
    }

    function setUserLevel( address _child , uint256 _level ) onlyOwner  public returns ( bool ) {
        Users[_child ].level = _level;
        return true;
    }

    function fetchMaxlevel ( ) view public returns ( uint256 level ) {
        level = MaxLevel;
    }

    function fetchUserDetails ( address _addr ) view public returns ( address parent , uint256 level , uint256 sales , uint256 share ) {
        parent = Users[_addr].parent;
        level = Users[_addr].level;
        sales = Users[_addr].sales;
        share = Users[_addr].share;
    }

    function fetchLevelDetails ( uint256 _level ) view public returns ( uint256 percent , uint256 sales ) {
        percent = Levels[_level].percent;
        sales = Levels[_level].salesLimit;
    }

    function activate() onlyOwner isInactive public returns ( bool ) {
        active = true;
        return true;
    }

    function inactivate() onlyOwner isActive public returns ( bool ) {
        active = false;
        return true;
    }

    function LevelChange ( address _addr )
        internal
    {
        uint256 curLevel = Users[_addr ].level;
        while( curLevel <= MaxLevel){
            if( ( Users[ _addr ].sales < Levels[ curLevel ].salesLimit ) ){
                break;
            }else{
                emit changeLevel( _addr , curLevel );
                Users[ _addr ].level = curLevel;
            }
            curLevel = curLevel.add(1);
        }
    }

    function LoopFx ( address _addr , uint256 _value , uint256 _shareRatio )
        internal
        returns ( uint256 value )
    {
        Users[ _addr ].sales = Users[ _addr ].sales.add( 1 );
        if( _shareRatio < Levels[ Users[ _addr ].level ].percent ){
            uint256 diff = Levels[ Users[ _addr ].level ].percent.sub(_shareRatio);
            Users[ _addr ].share = Users[ _addr ].share.add( _value.mul(diff).div(10000) );
            emit alloc( _addr , _value.mul(diff).div(10000) );
            value = Levels[ Users[ _addr ].level ].percent;
        }else if( _shareRatio == Levels[ Users[ _addr ].level ].percent ){
            emit alloc( _addr , 0 );
            value = Levels[ Users[ _addr ].level ].percent;
        }
        return value;
    }


    function purchase ( address _referer , string memory _value )
        isActive
        isVaildReferer( _referer )
        isValidValue
        payable
        public
        returns ( bool )
    {
        address Parent;
        uint256 cut = 0;
        uint256 tokens = TagR.fetchPrice();
        uint256 lx = 0;
        bool overflow = false;
        iMint( msg.sender , _value );
        if( Users[ msg.sender ].level == 0 ){
            Users[ msg.sender ].level = 1;
        }

        if( msg.value > tokens){
            msg.sender.transfer( msg.value.sub(tokens) );
        }

        if(  Users[ msg.sender ].parent == address(0)){
            Parent = _referer;
            Users[ msg.sender ].parent = Parent;
        }else{
            Parent = Users[ msg.sender ].parent;
        }
        while( lx < 100 ){
            lx = lx.add(1);
            cut = LoopFx( Parent , tokens , cut );
            LevelChange( Parent );
            if( Users[Parent ].parent == address(0)){
                break;
            }
            Parent = Users[ Parent ].parent;
            if( lx == 100){
                overflow = true;
            }
        }
        if( overflow ){
            cut = LoopFx( masterAddress , tokens , cut );
        }
        emit puchaseEvent( msg.sender , Users[ msg.sender ].parent , tokens , msg.value , _value );
        return true;
    }

    function iMint ( address _addr , string memory _value )
        internal
    {
        TagT.mintTokens( _addr , _value );
    }

    function claim(uint256 _amt)
        isActive
        isVaildClaim( _amt )
        payable
        public
        returns ( bool )
    {
        Users[ msg.sender ].share = Users[ msg.sender ].share.sub( _amt );
        msg.sender.transfer( _amt );
        emit claimEvent( msg.sender , _amt , Users[ msg.sender ].share );
        return true;
    }


}

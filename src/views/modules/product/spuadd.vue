<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-steps :active="step" finish-status="success">
          <el-step title="基本資料"></el-step>
          <el-step title="規格参數"></el-step>
          <el-step title="銷售屬性"></el-step>
          <el-step title="SKU資料"></el-step>
          <el-step title="保存完成"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24" v-show="step==0">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-form ref="spuBaseForm" :model="spu" label-width="120px" :rules="spuBaseInfoRules">
            <el-form-item label="商品名稱" prop="spuName">
              <el-input v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="spuDescription">
              <el-input v-model="spu.spuDescription"></el-input>
            </el-form-item>
            <el-form-item label="選擇分類" prop="catalogId">
              <category-cascader></category-cascader>
            </el-form-item>
            <el-form-item label="選擇品牌" prop="brandId">
              <brand-select></brand-select>
            </el-form-item>
            <el-form-item label="商品重量(Kg)" prop="weight">
              <el-input-number v-model.number="spu.weight" :min="0" :precision="3" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="設定積分" prop="bounds">
              <label>金幣</label>
              <el-input-number
                style="width:130px"
                placeholder="金幣"
                v-model="spu.bounds.buyBounds"
                :min="0"
                controls-position="right"
              ></el-input-number>
              <label style="margin-left:15px">成長值</label>
              <el-input-number
                style="width:130px"
                placeholder="成長值"
                v-model="spu.bounds.growBounds"
                :min="0"
                controls-position="right"
              >
                <template slot="prepend">成長值</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="商品介绍" prop="decript">
              <multi-upload v-model="spu.decript"></multi-upload>
            </el-form-item>

            <el-form-item label="商品圖集" prop="images">
              <multi-upload v-model="spu.images"></multi-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="collectSpuBaseInfo">下一步：設定基本参數</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step==1">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-tabs tab-position="left" style="width:98%">
            <el-tab-pane
              :label="group.attrGroupName"
              v-for="(group,gidx) in dataResp.attrGroups"
              :key="group.attrGroupId"
            >
              <!-- 遍歷屬性,每個tab-pane對應一個表單，每個屬性是一個表單項  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
              <el-form ref="form" :model="spu">
                <el-form-item
                  :label="attr.attrName"
                  v-for="(attr,aidx) in group.attrs"
                  :key="attr.attrId"
                >
                  <el-input
                    v-model="dataResp.baseAttrs[gidx][aidx].attrId"
                    type="hidden"
                    v-show="false"
                  ></el-input>
                  <el-select
                    v-model="dataResp.baseAttrs[gidx][aidx].attrValues"
                    :multiple="attr.valueType == 1"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="請選擇或输入值"
                  >
                    <el-option
                      v-for="(val,vidx) in attr.valueSelect.split(';')"
                      :key="vidx"
                      :label="val"
                      :value="val"
                    ></el-option>
                  </el-select>
                  <el-checkbox
                    v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
                    :true-label="1"
                    :false-label="0"
                  >快速展示</el-checkbox>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="margin:auto">
            <el-button type="primary" @click="step = 0">上一步</el-button>
            <el-button type="success" @click="generateSaleAttrs">下一步：設定銷售屬性</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step==2">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>選擇銷售屬性</span>
              <el-form ref="saleform" :model="spu">
                <el-form-item
                  :label="attr.attrName"
                  v-for="(attr,aidx) in dataResp.saleAttrs"
                  :key="attr.attrId"
                >
                  <el-input
                    v-model="dataResp.tempSaleAttrs[aidx].attrId"
                    type="hidden"
                    v-show="false"
                  ></el-input>
                  <el-checkbox-group v-model="dataResp.tempSaleAttrs[aidx].attrValues">
                    <el-checkbox
                      v-if="dataResp.saleAttrs[aidx].valueSelect != ''"
                      :label="val"
                      v-for="val in dataResp.saleAttrs[aidx].valueSelect.split(';')"
                      :key="val"
                    ></el-checkbox>
                    <div style="margin-left:20px;display:inline">
                      <el-button
                        v-show="!inputVisible[aidx].view"
                        class="button-new-tag"
                        size="mini"
                        @click="showInput(aidx)"
                      >+自定義</el-button>
                      <el-input
                        v-show="inputVisible[aidx].view"
                        v-model="inputValue[aidx].val"
                        :ref="'saveTagInput'+aidx"
                        size="mini"
                        style="width:150px"
                        @keyup.enter.native="handleInputConfirm(aidx)"
                        @blur="handleInputConfirm(aidx)"
                      ></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <el-button type="primary" @click="step = 1">上一步</el-button>
            <el-button type="success" @click="generateSkus">下一步：設定SKU資料</el-button>
          </el-card>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step==3">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-table :data="spu.skus" style="width: 100%">
            <el-table-column label="屬性組合">
              <el-table-column
                :label="item.attrName"
                v-for="(item,index) in dataResp.tableAttrColumn"
                :key="item.attrId"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.attr[index].attrValue }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="商品名稱" prop="skuName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuName"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="標題" prop="skuTitle">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuTitle"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="副標題" prop="skuSubtitle">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuSubtitle"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="價格" prop="price">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="24">
                    <label style="display:block;float:left">選擇圖集 或</label>
                    <multi-upload
                      style="float:left;margin-left:10px;"
                      :showFile="false"
                      :listType="'text'"
                      v-model="uploadImages"
                    ></multi-upload>
                  </el-col>
                  <el-col :span="24">
                    <el-divider></el-divider>
                  </el-col>
                  <el-col :span="24">
                    <el-card
                      style="width:170px;float:left;margin-left:15px;margin-top:15px;"
                      :body-style="{ padding: '0px' }"
                      v-for="(img,index) in spu.images"
                      :key="index"
                    >
                      <img :src="img" style="width:160px;height:120px" />
                      <div style="padding: 14px;">
                        <el-row>
                          <el-col :span="12">
                            <el-checkbox
                              v-model="scope.row.images[index].imgUrl"
                              :true-label="img"
                              false-label
                            ></el-checkbox>
                          </el-col>
                          <el-col :span="12">
                            <el-tag v-if="scope.row.images[index].defaultImg == 1">
                              <input
                                type="radio"
                                checked
                                :name="scope.row.skuName"
                                @change="checkDefaultImg(scope.row,index,img)"
                              />設為默認
                            </el-tag>
                            <el-tag v-else>
                              <input
                                type="radio"
                                :name="scope.row.skuName"
                                @change="checkDefaultImg(scope.row,index,img)"
                              />設為默認
                            </el-tag>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <!-- 折扣，滿減，會員價 -->
                <el-form :model="scope.row">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="設定折扣">
                        <label>滿</label>
                        <el-input-number
                          style="width:160px"
                          :min="0"
                          controls-position="right"
                          v-model="scope.row.fullCount"
                        ></el-input-number>
                        <label>件</label>

                        <label style="margin-left:15px;">打</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.discount"
                          :precision="2"
                          :max="1"
                          :min="0"
                          :step="0.01"
                          controls-position="right"
                        ></el-input-number>
                        <label>折</label>
                        <el-checkbox
                          v-model="scope.row.countStatus"
                          :true-label="1"
                          :false-label="0"
                        >可疊加優惠</el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="設定滿減">
                        <label>滿</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.fullPrice"
                          :step="100"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                        <label>元</label>
                        <label style="margin-left:15px;">減</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.reducePrice"
                          :step="10"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                        <label>元</label>
                        <el-checkbox
                          v-model="scope.row.priceStatus"
                          :true-label="1"
                          :false-label="0"
                        >可疊加優惠</el-checkbox>
                      </el-form-item>
                    </el-col>

                    <el-col :span="24">
                      <el-form-item label="設定會員價" v-if="scope.row.memberPrice.length>0">
                        <br />
                        <!--   @change="handlePriceChange(scope,mpidx,$event)" -->
                        <el-form-item v-for="(mp,mpidx) in scope.row.memberPrice" :key="mp.id">
                          {{mp.name}}
                          <el-input-number
                            style="width:160px"
                            v-model="scope.row.memberPrice[mpidx].price"
                            :precision="2"
                            :min="0"
                            controls-position="right"
                          ></el-input-number>
                        </el-form-item>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="step = 2">上一步</el-button>
          <el-button type="success" @click="submitSkus">下一步：保存商品資料</el-button>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step==4">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <h1>保存成功</h1>
          <el-button type="primary" @click="addAgian">繼續添加</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//這裡可以導入其他文件（比如：組件，工具js，第三方插件js，json文件，圖片文件等等）
//例如：import 《組件名稱》 from '《組件路徑》';
import CategoryCascader from "../common/category-cascader";
import BrandSelect from "../common/brand-select";
import MultiUpload from "@/components/upload/multiUpload";
export default {
  //import引入的組件需要注入到物件中才能使用
  components: { CategoryCascader, BrandSelect, MultiUpload },
  props: {},
  data() {
    return {
      catPathSub: null,
      brandIdSub: null,
      uploadDialogVisible: false,
      uploadImages: [],
      step: 0,
      //spu_name  spu_description  catalog_id  brand_id  weight  publish_status
      spu: {
        //要提交的資料
        spuName: "",
        spuDescription: "",
        catalogId: 0,
        brandId: "",
        weight: "",
        publishStatus: 0,
        decript: [], //商品詳情
        images: [], //商品圖集，最後sku也可以新增
        bounds: {
          //積分
          buyBounds: 0,
          growBounds: 0,
        },
        baseAttrs: [], //基本屬性
        skus: [], //所有sku資料
      },
      spuBaseInfoRules: {
        spuName: [
          { required: true, message: "請输入商品名稱", trigger: "blur" },
        ],
        spuDescription: [
          { required: true, message: "請编寫一個简單描述", trigger: "blur" },
        ],
        catalogId: [
          { required: true, message: "請選擇一個分類", trigger: "blur" },
        ],
        brandId: [
          { required: true, message: "請選擇一個品牌", trigger: "blur" },
        ],
        decript: [
          { required: false, message: "請上傳商品詳情圖集", trigger: "blur" },
        ],
        images: [
          { required: false, message: "請上傳商品圖片集", trigger: "blur" },
        ],
        weight: [
          {
            type: "number",
            required: true,
            message: "請填寫正確的重量值",
            trigger: "blur",
          },
        ],
      },
      dataResp: {
        //後台返回的所有資料
        attrGroups: [],
        baseAttrs: [],
        saleAttrs: [],
        tempSaleAttrs: [],
        tableAttrColumn: [],
        memberLevels: [],
        steped: [false, false, false, false, false],
      },
      inputVisible: [],
      inputValue: [],
    };
  },
  //計算屬性 類似於data概念
  computed: {},
  //監控data中的資料變化
  watch: {
    uploadImages(val) {
      // 擴展每個 skus 裡面的 imgs 選項
      let imgArr = Array.from(new Set(this.spu.images.concat(val)));
      // {imgUrl:"",defaultImg:0} 由於 concat 每次迭代上次，有很多重複。所以我们必須得到上次 + 這次的總長
      this.spu.skus.forEach((item, index) => {
        let len = imgArr.length - this.spu.skus[index].images.length; //還差這麼多
        if (len > 0) {
          let imgs = new Array(len);
          imgs = imgs.fill({ imgUrl: "", defaultImg: 0 });
          this.spu.skus[index].images = item.images.concat(imgs);
        }
      });

      this.spu.images = imgArr; //去重
      console.log("this.spu.skus", this.spu.skus);
    },
  },
  //方法集合
  methods: {
    addAgian() {
      this.step = 0;
      this.resetSpuData();
    },
    resetSpuData() {
      this.spu = {
        spuName: "",
        spuDescription: "",
        catalogId: 0,
        brandId: "",
        weight: "",
        publishStatus: 0,
        decript: [],
        images: [],
        bounds: {
          buyBounds: 0,
          growBounds: 0,
        },
        baseAttrs: [],
        skus: [],
      };
    },
    handlePriceChange(scope, mpidx, e) {
      this.spu.skus[scope.$index].memberPrice[mpidx].price = e;
    },
    getMemberLevels() {
      this.$http({
        url: this.$http.adornUrl("/member/memberlevel/list"),
        method: "get",
        params: this.$http.adornParams({
          page: 1,
          limit: 500,
        }),
      })
        .then(({ data }) => {
          this.dataResp.memberLevels = data.page.list;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showInput(idx) {
      console.log("``````", this.view);
      this.inputVisible[idx].view = true;
      // this.$refs['saveTagInput'+idx].$refs.input.focus();
    },
    checkDefaultImg(row, index, img) {
      console.log("默認圖片", row, index);
      //這個圖片被選中了，
      row.images[index].imgUrl = img; //默認選中
      row.images[index].defaultImg = 1; //修改標誌位;
      //修改其他人的標誌位
      row.images.forEach((item, idx) => {
        if (idx != index) {
          row.images[idx].defaultImg = 0;
        }
      });
    },
    handleInputConfirm(idx) {
      let inputValue = this.inputValue[idx].val;
      if (inputValue) {
        // this.dynamicTags.push(inputValue);
        if (this.dataResp.saleAttrs[idx].valueSelect == "") {
          this.dataResp.saleAttrs[idx].valueSelect = inputValue;
        } else {
          this.dataResp.saleAttrs[idx].valueSelect += ";" + inputValue;
        }
      }
      this.inputVisible[idx].view = false;
      this.inputValue[idx].val = "";
    },
    collectSpuBaseInfo() {
      //spuBaseForm
      this.$refs.spuBaseForm.validate((valid) => {
        if (valid) {
          this.step = 1;
          this.showBaseAttrs();
        } else {
          return false;
        }
      });
    },
    generateSaleAttrs() {
      //把頁面绑定的所有 attr 處理到 spu 裡面,這一步都要做
      this.spu.baseAttrs = [];
      this.dataResp.baseAttrs.forEach((item) => {
        item.forEach((attr) => {
          let { attrId, attrValues, showDesc } = attr;
          // 跳過没有录入值的屬性
          if (attrValues != "") {
            if (attrValues instanceof Array) {
              // 多個值用;隔開
              attrValues = attrValues.join(";");
            }
            this.spu.baseAttrs.push({ attrId, attrValues, showDesc });
          }
        });
      });
      console.log("baseAttrs", this.spu.baseAttrs);
      this.step = 2;
      this.getShowSaleAttr();
    },
    generateSkus() {
      this.step = 3;
      // 根據笛卡爾積運算進行生成 sku
      let selectValues = [];
      this.dataResp.tableAttrColumn = [];
      this.dataResp.tempSaleAttrs.forEach((item) => {
        if (item.attrValues.length > 0) {
          selectValues.push(item.attrValues);
          this.dataResp.tableAttrColumn.push(item);
        }
      });

      let descartes = this.descartes(selectValues);
      // [["黑色","6GB","移動"],["黑色","6GB","聯通"],["黑色","8GB","移動"],["黑色","8GB","聯通"],
      // ["白色","6GB","移動"],["白色","6GB","聯通"],["白色","8GB","移動"],["白色","8GB","聯通"],
      // ["蓝色","6GB","移動"],["蓝色","6GB","聯通"],["蓝色","8GB","移動"],["蓝色","8GB","聯通"]]
      console.log("生成的組合", JSON.stringify(descartes));
      // 有多少 descartes 就有多少 sku
      let skus = [];

      descartes.forEach((descar, descaridx) => {
        let attrArray = []; // sku 屬性組
        descar.forEach((de, index) => {
          // 構造 saleAttr 資料
          let saleAttrItem = {
            attrId: this.dataResp.tableAttrColumn[index].attrId,
            attrName: this.dataResp.tableAttrColumn[index].attrName,
            attrValue: de,
          };
          attrArray.push(saleAttrItem);
        });
        // 先初始化幾個 images，後面的上傳還要加
        let imgs = [];
        this.spu.images.forEach((img, idx) => {
          imgs.push({ imgUrl: "", defaultImg: 0 });
        });

        // 會員價，也必須在循環裡面生成，否則會導致資料绑定問題
        let memberPrices = [];
        if (this.dataResp.memberLevels.length > 0) {
          for (let i = 0; i < this.dataResp.memberLevels.length; i++) {
            if (this.dataResp.memberLevels[i].priviledgeMemberPrice == 1) {
              memberPrices.push({
                id: this.dataResp.memberLevels[i].id,
                name: this.dataResp.memberLevels[i].name,
                price: 0,
              });
            }
          }
        }
        //;descaridx，判斷如果之前有就用之前的值;
        let res = this.hasAndReturnSku(this.spu.skus, descar);
        if (res === null) {
          skus.push({
            attr: attrArray,
            skuName: this.spu.spuName + " " + descar.join(" "),
            price: 0,
            skuTitle: this.spu.spuName + " " + descar.join(" "),
            skuSubtitle: "",
            images: imgs,
            descar: descar,
            fullCount: 0,
            discount: 0,
            countStatus: 0,
            fullPrice: 0.0,
            reducePrice: 0.0,
            priceStatus: 0,
            memberPrice: new Array().concat(memberPrices),
          });
        } else {
          skus.push(res);
        }
      });
      this.spu.skus = skus;
      console.log("結果!!!", this.spu.skus, this.dataResp.tableAttrColumn);
    },
    // 判斷如果包含之前的 sku 的 descar 組合，就返回這個sku的詳细資料；
    hasAndReturnSku(skus, descar) {
      let res = null;
      if (skus.length > 0) {
        for (let i = 0; i < skus.length; i++) {
          if (skus[i].descar.join(" ") == descar.join(" ")) {
            res = skus[i];
          }
        }
      }
      return res;
    },
    getShowSaleAttr() {
      // 取得當前分類可以使用的銷售屬性
      if (!this.dataResp.steped[1]) {
        this.$http({
          url: this.$http.adornUrl(
            `/product/attr/sale/list/${this.spu.catalogId}`
          ),
          method: "get",
          params: this.$http.adornParams({
            page: 1,
            limit: 500,
          }),
        }).then(({ data }) => {
          this.dataResp.saleAttrs = data.page.list;
          data.page.list.forEach((item) => {
            this.dataResp.tempSaleAttrs.push({
              attrId: item.attrId,
              attrValues: [],
              attrName: item.attrName,
            });
            this.inputVisible.push({ view: false });
            this.inputValue.push({ val: "" });
          });
          this.dataResp.steped[1] = true;
        });
      }
    },
    showBaseAttrs() {
      if (!this.dataResp.steped[0]) {
        this.$http({
          url: this.$http.adornUrl(
            `/product/attrgroup/${this.spu.catalogId}/withattr`
          ),
          method: "get",
          params: this.$http.adornParams({}),
        }).then(({ data }) => {
          console.log("data: ", data);
          //先對表單的 baseAttrs 進行初始化
          data.data.forEach((item) => {
            let attrArray = [];
            item.attrs.forEach((attr) => {
              attrArray.push({
                attrId: attr.attrId,
                attrValues: "",
                showDesc: attr.showDesc,
              });
            });
            this.dataResp.baseAttrs.push(attrArray);
          });
          this.dataResp.steped[0] = 0;
          this.dataResp.attrGroups = data.data;
        });
      }
    },

    submitSkus() {
      console.log("~~~~~", JSON.stringify(this.spu));
      this.$confirm("將要提交商品資料，需要一小段時間，是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/product/spuinfo/save"),
            method: "post",
            data: this.$http.adornData(this.spu, false),
          }).then(({ data }) => {
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "新增商品成功!",
              });
              this.step = 4;
            } else {
              this.$message({
                type: "error",
                message: "保存失败，原因【" + data.msg + "】",
              });
            }
          });
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 笛卡爾積運算
    descartes(list) {
      // parent 上一級索引; count 指針計數
      var point = {};
      var result = [];
      var pIndex = null;
      var tempCount = 0;
      var temp = [];
      //根據参數列生成指針物件
      for (var index in list) {
        if (typeof list[index] == "object") {
          point[index] = { parent: pIndex, count: 0 };
          pIndex = index;
        }
      }

      //單維度資料結構直接返回
      if (pIndex == null) {
        return list;
      }

      //動泰生成笛卡爾積
      while (true) {
        for (var index in list) {
          tempCount = point[index]["count"];
          temp.push(list[index][tempCount]);
        }

        //壓入結果陣列
        result.push(temp);
        temp = [];

        //檢查指針最大值問題
        while (true) {
          if (point[index]["count"] + 1 >= list[index].length) {
            point[index]["count"] = 0;
            pIndex = point[index]["parent"];
            if (pIndex == null) {
              return result;
            }

            //賦值parent進行再次檢查
            index = pIndex;
          } else {
            point[index]["count"]++;
            break;
          }
        }
      }
    },
  },
  //生命週期 - 創建完成（可以訪問當前this實例）
  created() {},
  //生命週期 - 掛載完成（可以訪問DOM元素）
  mounted() {
    this.catPathSub = PubSub.subscribe("catPath", (msg, val) => {
      this.spu.catalogId = val[val.length - 1];
    });
    this.brandIdSub = PubSub.subscribe("brandId", (msg, val) => {
      this.spu.brandId = val;
    });
    this.getMemberLevels();
  },
  beforeCreate() {}, //生命週期 - 創建之前
  beforeMount() {}, //生命週期 - 掛載之前
  beforeUpdate() {}, //生命週期 - 更新之前
  updated() {}, //生命週期 - 更新之後
  beforeDestroy() {
    PubSub.unsubscribe(this.catPathSub);
    PubSub.unsubscribe(this.brandIdSub);
  }, //生命週期 - 銷毁之前
  destroyed() {}, //生命週期 - 銷毁完成
  activated() {}, //如果頁面有keep-alive緩存功能，這個函數會觸發
};
</script>
<style scoped>
</style>

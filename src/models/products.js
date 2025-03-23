const createProduct = "CREATE TABLE \`tourism_db\`.\`products\`(
    \`id\` INT NOT NULL AUTO_INCREMENT,
    \`name\` VARCHAR(40) NOT NULL COMMENT '品牌名',
    \`logo\` VARCHAR(45) NOT NULL COMMENT '品牌logo图片url',
    \`status\` TINYINT NOT NULL DEFAULT 0 COMMENT '0代表状态正常，1代表逻辑删除',
    PRIMARY KEY (\`id\`))
  COMMENT = '产品信息'
"
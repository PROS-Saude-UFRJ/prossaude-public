//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps } from "@wordpress/block-editor";
import FormControl from "./component";
registerBlockType("bootstrap/control", {
  title: "Campo de Controle",
  icon: "button",
  category: "bootstrap_ui",
  attributes: {
    preview: {
      type: "boolean",
      default: false,
    },
  },
  supports: {
    inserter: true,
    align: true,
    innerBlocks: true,
  },
  example: {
    attributes: {
      preview: true,
    },
    description: "Preview do Campo de Controle",
    innerBlocks: [],
  },
  edit: ({ attributes }: { attributes: { [k: string]: any } }) => {
    return attributes.preview ? (
      <div>
        <video
          src="http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/form_control.mp4"
          autoPlay
          loop
          playsInline
          muted
          crossOrigin="anonymous"
          className="controlPreview"
          disablePictureInPicture
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        ></video>
      </div>
    ) : (
      <fieldset {...useBlockProps()} style={{ border: "none" }} className="form-control-wrapper">
        <FormControl />
      </fieldset>
    );
  },
  save: () => null,
});
